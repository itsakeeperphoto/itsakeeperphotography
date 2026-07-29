/**
 * Cinematic homepage preloader
 *
 * A dependency-free WAAPI timeline. The component owns every visual node, so
 * this module never transforms or fades the page behind it. Only compositor-
 * friendly `transform` and `opacity` properties are animated.
 */

type PreloaderPhase = "entry" | "focus" | "capture" | "reveal" | "complete";

type FinishReason =
  | "timeline"
  | "reduced-motion"
  | "reduced-motion-change"
  | "escape"
  | "keyboard"
  | "hidden"
  | "pagehide"
  | "unsupported"
  | "inactive";

interface PreloaderQaController {
  readonly duration: number;
  readonly phase: PreloaderPhase;
  seek(milliseconds: number): {
    phase: PreloaderPhase;
    time: number;
  };
}

declare global {
  interface Window {
    __sitePreloaderFailsafe?: number;
    __sitePreloaderComplete?: boolean;
    __sitePreloaderStartedAt?: number;
    __SITE_PRELOADER_QA__?: PreloaderQaController;
  }
}

(() => {
  "use strict";

  const root = document.querySelector<HTMLElement>("[data-site-preloader]");
  if (!root) return;

  const html = document.documentElement;
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const qaMode = html.classList.contains("is-preloader-qa");
  const timelineDuration = 3000;

  let finished = false;
  let timelineTimer: number | undefined;
  const phaseTimers: number[] = [];
  const animations: Animation[] = [];

  const query = <ElementType extends Element>(selector: string) =>
    root.querySelector<ElementType>(selector);

  const elements = {
    cameraStage: query<HTMLElement>("#site-preloader-camera-stage"),
    cameraFloat: query<HTMLElement>("#site-preloader-camera-float"),
    lensOuter: query<SVGGElement>("#lens-outer"),
    lensMid: query<SVGGElement>("#lens-mid"),
    lensInner: query<SVGGElement>("#lens-inner"),
    lensGlass: query<SVGGElement>("#lens-glass"),
    shutterButton: query<SVGGElement>("#shutter-button"),
    irisTop: query<SVGPathElement>("#iris-top"),
    irisBottom: query<SVGPathElement>("#iris-bottom"),
    glint: query<SVGGElement>("#flash-glint"),
    viewfinder: query<SVGGElement>("#viewfinder-frames"),
    flash: query<HTMLElement>("#site-preloader-flash"),
    panelTop: query<HTMLElement>("#site-preloader-panel-top"),
    panelBottom: query<HTMLElement>("#site-preloader-panel-bottom"),
  };

  const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

  /**
   * Register every animation in one place so an interrupted timeline can be
   * cancelled immediately and cannot keep consuming compositor resources.
   */
  const play = (
    element: Element | null,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions
  ) => {
    if (!element || finished) return null;

    const animation = element.animate(keyframes, {
      fill: "both",
      ...options,
    });

    animations.push(animation);
    return animation;
  };

  const emit = (name: "statechange" | "complete", detail: object) => {
    window.dispatchEvent(
      new CustomEvent(`site-preloader:${name}`, {
        detail,
      })
    );
  };

  const setPhase = (phase: PreloaderPhase) => {
    html.dataset.preloaderState = phase;
    root.dataset.phase = phase;
    emit("statechange", { phase });
  };

  const phaseAt = (milliseconds: number): PreloaderPhase => {
    if (milliseconds >= 2900) return "complete";
    if (milliseconds >= 1900) return "reveal";
    if (milliseconds >= 1400) return "capture";
    if (milliseconds >= 600) return "focus";
    return "entry";
  };

  const schedulePhase = (phase: PreloaderPhase, delay: number) => {
    phaseTimers.push(window.setTimeout(() => setPhase(phase), delay));
  };

  const removeListeners = () => {
    motionPreference.removeEventListener("change", handleMotionChange);
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide);
  };

  /**
   * One idempotent exit path handles completion, fallbacks and interruptions.
   * Removing the overlay restores interaction without touching page layout.
   */
  const finish = (reason: FinishReason = "timeline") => {
    if (finished) return;
    finished = true;

    if (timelineTimer !== undefined) window.clearTimeout(timelineTimer);
    if (window.__sitePreloaderFailsafe !== undefined) {
      window.clearTimeout(window.__sitePreloaderFailsafe);
      delete window.__sitePreloaderFailsafe;
    }

    phaseTimers.forEach((timer) => window.clearTimeout(timer));
    animations.forEach((animation) => animation.cancel());
    removeListeners();

    html.classList.remove("is-preloading", "is-preloader-qa");
    setPhase("complete");

    root.setAttribute("aria-hidden", "true");
    root.hidden = true;
    root.remove();

    window.__sitePreloaderComplete = true;
    delete window.__SITE_PRELOADER_QA__;
    emit("complete", { phase: "complete", reason });
  };

  function handleMotionChange(event: MediaQueryListEvent) {
    if (event.matches) finish("reduced-motion-change");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") finish("escape");
    if (event.key === "Tab") finish("keyboard");
  }

  function handleVisibilityChange() {
    if (document.hidden) finish("hidden");
  }

  function handlePageHide() {
    finish("pagehide");
  }

  const startTimeline = () => {
    if (finished) return;

    if (motionPreference.matches) {
      finish("reduced-motion");
      return;
    }

    if (!html.classList.contains("is-preloading")) {
      finish("inactive");
      return;
    }

    window.__sitePreloaderStartedAt = performance.now();
    window.__sitePreloaderComplete = false;
    setPhase("entry");

    if (!qaMode) {
      schedulePhase("focus", 600);
      schedulePhase("capture", 1400);
      schedulePhase("reveal", 1900);
    }

    /* Phase 0 — camera enters with one controlled weighted settle. */
    play(
      elements.cameraStage,
      [
        {
          opacity: 0,
          transform: "translate3d(0, 8px, 0) scale(0.85)",
          offset: 0,
        },
        {
          opacity: 1,
          transform: "translate3d(0, -1px, 0) scale(1.025)",
          offset: 0.72,
        },
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
          offset: 1,
        },
      ],
      {
        duration: 600,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );

    /* Phase 1 — calm float, rack focus and composition frame. */
    play(
      elements.cameraFloat,
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, -3px, 0)", offset: 0.5 },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        delay: 600,
        duration: 800,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.lensOuter,
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(3.5deg) scale(1.025)", offset: 0.52 },
        { transform: "rotate(1deg) scale(1)" },
      ],
      {
        delay: 620,
        duration: 720,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.lensMid,
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(-5deg) scale(0.985)", offset: 0.5 },
        { transform: "rotate(-1.5deg) scale(1)" },
      ],
      {
        delay: 650,
        duration: 690,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.lensInner,
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(6deg) scale(1.035)", offset: 0.48 },
        { transform: "rotate(1deg) scale(1)" },
      ],
      {
        delay: 680,
        duration: 650,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.lensGlass,
      [
        { transform: "scale(1)" },
        { transform: "scale(0.94)", offset: 0.5 },
        { transform: "scale(1)" },
      ],
      {
        delay: 700,
        duration: 590,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.glint,
      [
        {
          opacity: 0,
          transform: "translate3d(-92px, 0, 0) scale(0.98)",
        },
        {
          opacity: 0.72,
          transform: "translate3d(0, 0, 0) scale(1)",
          offset: 0.48,
        },
        {
          opacity: 0,
          transform: "translate3d(92px, 0, 0) scale(1.02)",
        },
      ],
      {
        delay: 790,
        duration: 430,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );

    play(
      elements.viewfinder,
      [
        { opacity: 0, transform: "scale(1.08)" },
        { opacity: 0.72, transform: "scale(1)", offset: 0.34 },
        { opacity: 0.58, transform: "scale(0.985)", offset: 0.76 },
        { opacity: 0, transform: "scale(0.985)" },
      ],
      {
        delay: 640,
        duration: 760,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );

    /* Phase 2 — physical shutter press, flash, iris and camera kick. */
    play(
      elements.shutterButton,
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, 6px, 0)", offset: 0.46 },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        delay: 1410,
        duration: 190,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );

    play(
      elements.irisTop,
      [
        { transform: "translate3d(0, -72px, 0)" },
        { transform: "translate3d(0, 0, 0)", offset: 0.36 },
        { transform: "translate3d(0, -72px, 0)" },
      ],
      {
        delay: 1470,
        duration: 250,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.irisBottom,
      [
        { transform: "translate3d(0, 72px, 0)" },
        { transform: "translate3d(0, 0, 0)", offset: 0.36 },
        { transform: "translate3d(0, 72px, 0)" },
      ],
      {
        delay: 1470,
        duration: 250,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.flash,
      [
        {
          opacity: 0,
          offset: 0,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        {
          opacity: 0.94,
          offset: 0.22,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
        {
          opacity: 0.76,
          offset: 0.36,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
        { opacity: 0, offset: 1 },
      ],
      {
        delay: 1490,
        duration: 420,
        easing: "cubic-bezier(0.3, 0.01, 0.7, 0.99)",
      }
    );

    play(
      elements.cameraFloat,
      [
        { transform: "translate3d(0, 0, 0) rotate(0deg)" },
        {
          transform: "translate3d(0, -4px, 0) rotate(-0.35deg)",
          offset: 0.28,
        },
        {
          transform: "translate3d(0, 1px, 0) rotate(0.1deg)",
          offset: 0.68,
        },
        { transform: "translate3d(0, 0, 0) rotate(0deg)" },
      ],
      {
        delay: 1500,
        duration: 260,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );

    /*
     * Phase 3 — as the physical shutter re-opens, the camera recedes and the
     * two dark curtains expose the homepage. There is no intermediate logo.
     */
    play(
      elements.cameraStage,
      [
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
        },
        {
          opacity: 0,
          transform: "translate3d(0, -3px, 0) scale(0.94)",
        },
      ],
      {
        delay: 1810,
        duration: 390,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );

    play(
      elements.panelTop,
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, -100%, 0)" },
      ],
      {
        delay: 1900,
        duration: 900,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    play(
      elements.panelBottom,
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, 100%, 0)" },
      ],
      {
        delay: 1900,
        duration: 900,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
      }
    );

    if (qaMode) {
      animations.forEach((animation) => {
        animation.pause();
        animation.currentTime = 0;
      });

      window.__SITE_PRELOADER_QA__ = {
        duration: timelineDuration,
        get phase() {
          return (root.dataset.phase as PreloaderPhase) ?? "complete";
        },
        seek(milliseconds: number) {
          const time = Math.max(0, Math.min(timelineDuration, milliseconds));

          animations.forEach((animation) => {
            animation.pause();
            animation.currentTime = time;
          });

          const phase = phaseAt(time);
          setPhase(phase);
          window.__sitePreloaderComplete = phase === "complete";

          return { phase, time };
        },
      };

      return;
    }

    timelineTimer = window.setTimeout(
      () => finish("timeline"),
      timelineDuration
    );
  };

  const boot = async () => {
    if (motionPreference.matches) {
      finish("reduced-motion");
      return;
    }

    if (!html.classList.contains("is-preloading")) {
      finish("inactive");
      return;
    }

    if (typeof Element.prototype.animate !== "function") {
      finish("unsupported");
      return;
    }

    /**
     * Give the homepage fonts a brief chance to settle before the shutter
     * exposes the site, without depending on font availability.
     */
    if (document.fonts?.ready) {
      await Promise.race([document.fonts.ready, wait(180)]);
    }

    startTimeline();
  };

  motionPreference.addEventListener("change", handleMotionChange);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", handlePageHide);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    void boot();
  }
})();

export {};
