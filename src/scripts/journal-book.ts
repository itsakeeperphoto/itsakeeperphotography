import type {
  PageFlip,
  PageFlipOrientation,
} from "page-flip/dist/js/page-flip.module.js";

const MOBILE_QUERY = "(max-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const rememberedPagePaths = new Map<string, string>();

class JournalBookElement extends HTMLElement {
  #abortController: AbortController | null = null;
  #intersectionObserver: IntersectionObserver | null = null;
  #motionPreference: MediaQueryList | null = null;
  #mobilePreference: MediaQueryList | null = null;
  #pageFlip: PageFlip | null = null;
  #stage: HTMLElement | null = null;
  #volume: HTMLElement | null = null;
  #previousButton: HTMLButtonElement | null = null;
  #nextButton: HTMLButtonElement | null = null;
  #currentLabel: HTMLElement | null = null;
  #status: HTMLElement | null = null;
  #pageMarkup = "";
  #pageTitles: string[] = [];
  #pagePaths: string[] = [];
  #instanceId = "journal-book";
  #activePage = 0;
  #hasHydrated = false;
  #reinitializing = false;
  #crossfadeTimer = 0;
  #gsapContext: { revert: () => void } | null = null;

  connectedCallback() {
    if (this.#abortController) return;

    this.#abortController = new AbortController();
    this.#stage = this.querySelector<HTMLElement>("[data-journal-stage]");
    this.#volume = this.querySelector<HTMLElement>(".journal-book__volume");
    this.#previousButton = this.querySelector<HTMLButtonElement>("[data-journal-previous]");
    this.#nextButton = this.querySelector<HTMLButtonElement>("[data-journal-next]");
    this.#currentLabel = this.querySelector<HTMLElement>("[data-journal-current]");
    this.#status = this.querySelector<HTMLElement>("[data-journal-status]");
    this.#instanceId = this.dataset.journalInstance || this.id || "journal-book";

    const originalPages = this.#pages();
    this.#pageMarkup = originalPages.map((page) => page.outerHTML).join("");
    this.#pageTitles = originalPages.map(
      (page, index) => page.dataset.pageTitle || `Journal page ${index + 1}`
    );
    this.#pagePaths = originalPages.map(
      (page, index) => page.dataset.pagePath || this.#pageTitles[index]
    );
    this.dataset.enhanced = "true";

    const signal = this.#abortController.signal;
    this.#previousButton?.addEventListener("click", () => this.#turn(-1), { signal });
    this.#nextButton?.addEventListener("click", () => this.#turn(1), { signal });
    this.addEventListener("keydown", this.#onKeyDown, { signal });

    this.#motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    this.#mobilePreference = window.matchMedia(MOBILE_QUERY);
    this.#motionPreference.addEventListener("change", this.#onMotionPreferenceChange);
    this.#mobilePreference.addEventListener("change", this.#onViewportModeChange);

    this.#animateEntrance();

    if ("IntersectionObserver" in window) {
      this.#intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.#intersectionObserver?.disconnect();
          this.#intersectionObserver = null;
          void this.#hydrate(this.#rememberedStartPage());
        },
        { rootMargin: "400px 0px" }
      );
      this.#intersectionObserver.observe(this);
    } else {
      void this.#hydrate(this.#rememberedStartPage());
    }
  }

  disconnectedCallback() {
    const currentPage = this.#pageFlip?.getCurrentPageIndex() ?? this.#activePage;
    const currentPath = this.#pagePaths[currentPage];
    if (currentPath) rememberedPagePaths.set(this.#instanceId, currentPath);
    window.clearTimeout(this.#crossfadeTimer);
    this.#intersectionObserver?.disconnect();
    this.#motionPreference?.removeEventListener("change", this.#onMotionPreferenceChange);
    this.#mobilePreference?.removeEventListener("change", this.#onViewportModeChange);
    this.#abortController?.abort();
    this.#gsapContext?.revert();
    this.#destroyPageFlip();

    this.#abortController = null;
    this.#intersectionObserver = null;
    this.#motionPreference = null;
    this.#mobilePreference = null;
    this.#gsapContext = null;
  }

  #pages() {
    return this.#stage
      ? Array.from(this.#stage.querySelectorAll<HTMLElement>(".journal-sheet"))
      : [];
  }

  async #hydrate(startPage = 0) {
    if (!this.isConnected || this.#hasHydrated || this.#reinitializing) return;
    this.#hasHydrated = true;
    this.dataset.hydration = "loading";

    if (this.#motionPreference?.matches) {
      this.#initializeReducedMode(startPage);
      return;
    }

    try {
      const { PageFlip: PageFlipConstructor } = await import(
        "page-flip/dist/js/page-flip.module.js"
      );
      if (!this.isConnected || !this.#stage) return;

      const pageCount = this.#pageTitles.length;
      const safeStartPage = Math.min(Math.max(startPage, 0), Math.max(pageCount - 1, 0));
      this.#pageFlip = new PageFlipConstructor(this.#stage, {
        width: 520,
        height: 650,
        size: "stretch",
        minWidth: 280,
        maxWidth: 520,
        minHeight: 350,
        maxHeight: 650,
        startPage: safeStartPage,
        drawShadow: true,
        flippingTime: 1200,
        usePortrait: true,
        startZIndex: 10,
        autoSize: true,
        maxShadowOpacity: 0.5,
        showCover: false,
        mobileScrollSupport: true,
        swipeDistance: 20,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      this.#pageFlip.on<number>("flip", ({ data }) => {
        this.#activePage = data;
        const activePath = this.#pagePaths[data];
        if (activePath) rememberedPagePaths.set(this.#instanceId, activePath);
        this.#updateControls(data, this.#pageFlip?.getOrientation() || "landscape");
      });
      this.#pageFlip.on<PageFlipOrientation>("changeOrientation", ({ data }) => {
        this.#updateControls(this.#pageFlip?.getCurrentPageIndex() || 0, data);
      });
      this.#pageFlip.on<string>("changeState", ({ data }) => {
        this.dataset.flipState = data;
      });
      this.#pageFlip.on<{ page: number; mode: PageFlipOrientation }>("init", ({ data }) => {
        this.dataset.mode = "page-flip";
        this.dataset.hydration = "ready";
        this.#activePage = data.page;
        this.#updateControls(data.page, data.mode);
        this.#refreshScrollTrigger();
      });

      this.#pageFlip.loadFromHTML(this.#pages());
    } catch (error) {
      console.error("The journal page-turner could not load; using the accessible fallback.", error);
      this.#destroyPageFlip();
      this.#rebuildStage();
      this.#initializeReducedMode(startPage);
    }
  }

  #initializeReducedMode(startPage = 0) {
    this.dataset.mode = "crossfade";
    this.dataset.hydration = "ready";
    this.#activePage = this.#normalizeReducedPage(startPage);
    this.#showReducedPages(this.#activePage);
    this.#updateControls(
      this.#activePage,
      this.#mobilePreference?.matches ? "portrait" : "landscape"
    );
    this.#refreshScrollTrigger();
  }

  #turn(direction: -1 | 1) {
    if (this.dataset.hydration !== "ready") return;

    if (this.#pageFlip) {
      if (this.#pageFlip.getState() !== "read") return;
      if (direction > 0) this.#pageFlip.flipNext("bottom");
      else this.#pageFlip.flipPrev("bottom");
      return;
    }

    const step = this.#mobilePreference?.matches ? 1 : 2;
    const maximum = Math.max(this.#pageTitles.length - step, 0);
    const nextPage = Math.min(Math.max(this.#activePage + direction * step, 0), maximum);
    if (nextPage === this.#activePage) return;

    this.dataset.transitioning = "true";
    window.clearTimeout(this.#crossfadeTimer);
    this.#crossfadeTimer = window.setTimeout(() => {
      this.#activePage = nextPage;
      this.#showReducedPages(nextPage);
      this.#updateControls(
        nextPage,
        this.#mobilePreference?.matches ? "portrait" : "landscape"
      );
      requestAnimationFrame(() => delete this.dataset.transitioning);
    }, 120);
  }

  #showReducedPages(startPage: number) {
    const portrait = this.#mobilePreference?.matches ?? false;
    this.#pages().forEach((page, index) => {
      const visible = index === startPage || (!portrait && index === startPage + 1);
      page.classList.toggle("is-visible", visible);
      page.setAttribute("aria-hidden", visible ? "false" : "true");
    });
  }

  #updateControls(pageIndex: number, orientation: PageFlipOrientation) {
    const count = this.#pageTitles.length;
    const visibleCount = orientation === "landscape" ? 2 : 1;
    const firstPage = Math.min(pageIndex + 1, count);
    const lastPage = Math.min(pageIndex + visibleCount, count);
    const atStart = pageIndex <= 0;
    const atEnd = pageIndex >= Math.max(count - visibleCount, 0);

    if (this.#previousButton) this.#previousButton.disabled = atStart;
    if (this.#nextButton) this.#nextButton.disabled = atEnd;
    if (this.#currentLabel) {
      this.#currentLabel.textContent = String(lastPage || 1).padStart(2, "0");
    }

    if (this.#status) {
      const titles = this.#pageTitles.slice(firstPage - 1, lastPage).filter(Boolean).join("; ");
      this.#status.textContent = orientation === "landscape" && lastPage > firstPage
        ? `Pages ${firstPage} and ${lastPage} of ${count}: ${titles}`
        : `Page ${firstPage} of ${count}: ${titles}`;
    }
  }

  #normalizeReducedPage(page: number) {
    const maximum = Math.max(this.#pageTitles.length - 1, 0);
    const clamped = Math.min(Math.max(page, 0), maximum);
    return this.#mobilePreference?.matches ? clamped : Math.floor(clamped / 2) * 2;
  }

  #rememberedStartPage() {
    const rememberedPagePath = rememberedPagePaths.get(this.#instanceId);
    if (!rememberedPagePath) return 0;
    const index = this.#pagePaths.indexOf(rememberedPagePath);
    return index >= 0 ? index : 0;
  }

  #rebuildStage() {
    this.#stage?.remove();
    const stage = document.createElement("div");
    stage.className = "journal-book__stage";
    stage.dataset.journalStage = "";
    stage.innerHTML = this.#pageMarkup;
    this.#volume?.append(stage);
    this.#stage = stage;
  }

  #destroyPageFlip() {
    if (!this.#pageFlip) return;
    try {
      this.#pageFlip.destroy();
    } catch {
      this.#stage?.remove();
    }
    this.#pageFlip = null;
    this.#stage = null;
  }

  #onKeyDown = (event: KeyboardEvent) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.#turn(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.#turn(1);
    }
  };

  #onMotionPreferenceChange = () => {
    if (!this.#hasHydrated || this.#reinitializing) return;
    void this.#reinitialize();
  };

  #onViewportModeChange = () => {
    if (this.dataset.mode !== "crossfade") return;
    this.#activePage = this.#normalizeReducedPage(this.#activePage);
    this.#showReducedPages(this.#activePage);
    this.#updateControls(
      this.#activePage,
      this.#mobilePreference?.matches ? "portrait" : "landscape"
    );
  };

  async #reinitialize() {
    this.#reinitializing = true;
    const page = this.#pageFlip?.getCurrentPageIndex() ?? this.#activePage;
    this.#destroyPageFlip();
    this.#rebuildStage();
    delete this.dataset.mode;
    delete this.dataset.hydration;
    this.#hasHydrated = false;
    this.#reinitializing = false;
    await this.#hydrate(page);
  }

  #animateEntrance() {
    if (this.#motionPreference?.matches) return;
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    this.#gsapContext = gsap.context(() => {
      gsap.fromTo(
        this,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: this, start: "top 88%", once: true },
        }
      );
    }, this.parentElement || this);
  }

  #refreshScrollTrigger() {
    requestAnimationFrame(() => (window as any).ScrollTrigger?.refresh());
  }
}

if (!customElements.get("journal-book")) {
  customElements.define("journal-book", JournalBookElement);
}
