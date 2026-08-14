async (page) => {
  const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:4321";
  const routes = [
    ["home", "/"],
    ["family", "/family-photographer-tri-cities-wa/"],
    ["seniors", "/senior-photographer-tri-cities-wa/"],
    ["newborn", "/newborn-photographer-tri-cities-wa/"],
    ["branding", "/branding-photographer-tri-cities-wa/"],
    ["headshots", "/headshot-photographer-tri-cities-wa/"],
    ["investment", "/investment/"],
    ["about", "/about/"],
    ["reviews", "/reviews/"],
    ["contact", "/contact/"],
    ["richland", "/richland-wa-photographer/"],
    ["kennewick", "/kennewick-wa-photographer/"],
    ["pasco", "/pasco-wa-photographer/"],
    ["journal", "/journal/"],
    ["journal-family-locations", "/journal/family-photo-locations-tri-cities/"],
    ["journal-senior-timing", "/journal/when-to-book-senior-pictures-tri-cities/"],
    ["journal-newborn-comparison", "/journal/in-home-vs-studio-newborn-photography/"],
    ["journal-branding-vs-headshots", "/journal/branding-photos-vs-headshots/"],
    ["privacy", "/privacy/"],
    ["thank-you", "/thank-you/"],
  ];
  const viewports = [
    ["1440x1000", 1440, 1000],
    ["1200x900", 1200, 900],
    ["900x900", 900, 900],
    ["390x844", 390, 844],
  ];
  const primaryPaths = new Set([
    "/senior-photographer-tri-cities-wa/",
    "/family-photographer-tri-cities-wa/",
    "/newborn-photographer-tri-cities-wa/",
    "/branding-photographer-tri-cities-wa/",
    "/headshot-photographer-tri-cities-wa/",
    "/about/",
    "/reviews/",
    "/contact/",
  ]);
  const expandedDirectoryLinkCounts = new Map([
    ["/richland-wa-photographer/", 9],
    ["/kennewick-wa-photographer/", 9],
    ["/pasco-wa-photographer/", 8],
  ]);
  const activeCityGalleryContracts = {
    "/richland-wa-photographer/": {
      city: "Richland",
      pageKey: "richland",
      galleryId: "recent-richland-sessions",
      gallerySelector: ".richland-recent__gallery",
      finalId: "richland-final",
      figureCount: 10,
      h2Texts: [
        "This Isn't a City I Travel To — It's Where I Live",
        "Twenty Years of Watching This Light",
        "What I Photograph in Richland",
        "Recent Richland Sessions",
        "Planning a Session Here",
        "Richland Questions",
        "Let's Find Your Light",
      ],
      internalAnchors: [
        "/about/",
        "/journal/family-photo-locations-tri-cities/",
        "/senior-photographer-tri-cities-wa/",
        "/family-photographer-tri-cities-wa/",
        "/newborn-photographer-tri-cities-wa/",
        "/branding-photographer-tri-cities-wa/",
        "/headshot-photographer-tri-cities-wa/",
        "/investment/",
        "/contact/",
      ],
      images: [
        {
          src: "/uploads/richland-couple-river-portrait.jpg",
          alt: "Couple standing together in shallow river water beneath leafy trees.",
        },
        {
          src: "/uploads/richland-couple-winter-field.jpg",
          alt: "Couple embracing in dry winter grass.",
        },
        {
          src: "/uploads/richland-mother-newborn-at-home.jpg",
          alt: "Mother holding a sleeping newborn beside a bed.",
        },
        {
          src: "/uploads/richland-family-field-black-white.jpg",
          alt: "Family of three standing together in a field in a black-and-white portrait.",
        },
        {
          src: "/uploads/richland-family-embrace-black-white.jpg",
          alt: "Family laughing together beneath bare trees in a black-and-white portrait.",
        },
        {
          src: "/uploads/richland-maternity-field-portrait.jpg",
          alt: "Expectant couple standing together in a sunlit field.",
        },
        {
          src: "/uploads/richland-senior-suit-portrait.jpg",
          alt: "High school senior in a dark suit leaning against a concrete column.",
        },
        {
          src: "/uploads/richland-senior-autumn-dress.jpg",
          alt: "High school senior in a dark dress standing among autumn leaves.",
        },
        {
          src: "/uploads/richland-senior-seated-golden-hour.jpg",
          alt: "High school senior with glasses seated in warm evening grass.",
        },
        {
          src: "/uploads/richland-senior-autumn-portrait.jpg",
          alt: "High school senior standing in front of golden autumn foliage.",
        },
      ],
    },
    "/kennewick-wa-photographer/": {
      city: "Kennewick",
      pageKey: "kennewick",
      galleryId: "recent-kennewick-sessions",
      gallerySelector: ".kennewick-recent__gallery",
      finalId: "kennewick-final",
      figureCount: 5,
      h2Texts: [
        "Ten Minutes From My Front Door",
        "If Light and Airy Isn't What You Pictured",
        "What Works Well in Kennewick",
        "What I Photograph in Kennewick",
        "Recent Kennewick Sessions",
        "Kennewick Questions",
        "Let's Plan Yours",
      ],
      internalAnchors: [
        "/about/",
        "/journal/family-photo-locations-tri-cities/",
        "/family-photographer-tri-cities-wa/",
        "/senior-photographer-tri-cities-wa/",
        "/family-photographer-tri-cities-wa/",
        "/newborn-photographer-tri-cities-wa/",
        "/branding-photographer-tri-cities-wa/",
        "/headshot-photographer-tri-cities-wa/",
        "/contact/",
      ],
      images: [
        {
          src: "/uploads/kennewick-couple-laughing-golden-hour.jpg",
          alt: "Couple laughing together in warm evening light beneath bare trees.",
        },
        {
          src: "/uploads/kennewick-senior-seated-autumn-portrait.jpg",
          alt: "High school senior with glasses seated in dry grass beneath autumn trees.",
        },
        {
          src: "/uploads/kennewick-senior-cowboy-rope-golden-hour.jpg",
          alt: "High school senior in a cowboy hat holding a rope in a golden field.",
        },
        {
          src: "/uploads/kennewick-senior-wood-wall-portrait.jpg",
          alt: "High school senior in a white sweatshirt leaning beside a weathered wooden post.",
        },
        {
          src: "/uploads/review-isabella-senior-golden-hour-tricities.jpg",
          alt: "High school senior surrounded by roses in warm evening light.",
        },
      ],
    },
  };
  const report = [];

  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const [id, pathname] of routes) {
    for (const [viewport, width, height] of viewports) {
      const activeCityGallery = activeCityGalleryContracts[pathname] || null;
      const consoleErrors = [];
      const failedRequests = [];
      const onConsole = (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onRequestFailed = (request) => {
        failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText || "failed"}`);
      };
      page.on("console", onConsole);
      page.on("requestfailed", onRequestFailed);

      await page.setViewportSize({ width, height });
      const response = await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle" });

      await page.evaluate(async () => {
        const images = [...document.images];
        images.forEach((image) => { image.loading = "eager"; });
        await Promise.race([
          Promise.all(images.map((image) => image.decode().catch(() => undefined))),
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);
      });

      await page.evaluate(async () => {
        const step = Math.max(window.innerHeight * 0.8, 500);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 12));
        }
        window.scrollTo(0, 0);
      });

      await page.screenshot({
        path: `artifacts/qa/${id}/${viewport}.png`,
        fullPage: true,
        animations: "disabled",
      });

      let menu = null;
      if (width <= 1250) {
        const toggle = page.locator(".menu-toggle");
        if (await toggle.count()) {
          await toggle.click();
          const opened = await toggle.getAttribute("aria-expanded");
          const scrollLocked = await page.locator("body").evaluate((element) =>
            element.classList.contains("menu-open")
          );
          await page.mouse.click(width - 4, 4);
          const outsideClosed = await toggle.getAttribute("aria-expanded");
          await toggle.click();
          await page.keyboard.press("Escape");
          const closed = await toggle.getAttribute("aria-expanded");
          const focusReturned = await toggle.evaluate((element) => document.activeElement === element);
          menu = { opened, outsideClosed, closed, focusReturned, scrollLocked };
        }
      }

      await page.keyboard.press("Tab");
      const focus = await page.evaluate(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) return null;
        const style = getComputedStyle(active);
        return {
          tag: active.tagName,
          text: active.textContent?.trim().slice(0, 60) || "",
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          boxShadow: style.boxShadow,
          visiblyOutlined:
            (style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0) ||
            style.boxShadow !== "none",
        };
      });

      const checks = await page.evaluate((activeCityGallery) => {
        const origin = location.origin;
        const normalize = (value) => value?.replace(/\s+/g, " ").trim() || "";
        const internalBodyLinks = [...document.querySelectorAll("main a[href]")].filter((anchor) => {
          const raw = anchor.getAttribute("href") || "";
          if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return false;
          const url = new URL(raw, location.href);
          return url.origin === origin;
        });
        const visibleText = [...document.querySelectorAll(
          "main p:not(.page-eyebrow):not(.section-eyebrow):not(.editorial-item__detail):not(.editorial-item__attribution):not(.hero__trust):not(.inquiry-step__number):not(.journal-book__hint):not(.journal-book__progress):not(.journal-section__script), main li, main blockquote"
        )].filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          const isPascoUtility = element.matches(
            ".pasco-eyebrow, .pasco-rivers__caption, .pasco-farmland__aside, .pasco-directory__caption, .pasco-gallery__count, .pasco-seasons__label, .pasco-seasons__number",
          );
          return (
            !isPascoUtility &&
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          );
        });
        const textSizes = visibleText.map((element) => Number.parseFloat(getComputedStyle(element).fontSize));
        const images = [...document.images].map((image) => ({
          src: image.currentSrc || image.src,
          width: image.getAttribute("width"),
          height: image.getAttribute("height"),
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          complete: image.complete,
        }));
        const content = document.querySelector("[data-signature-device]");
        let activeCityGalleryContract = null;
        if (activeCityGallery) {
          const main = document.querySelector("main");
          const hero = main?.querySelector(
            `[data-editorial-hero-page="${activeCityGallery.pageKey}"]`,
          );
          const heroButtons = [...(hero?.querySelectorAll("button[data-hero-cta]") || [])];
          const gallerySection = document.getElementById(activeCityGallery.galleryId);
          const gallery = gallerySection?.querySelector(activeCityGallery.gallerySelector);
          const figures = [...(gallery?.querySelectorAll(":scope > figure") || [])];
          const galleryImages = [...(gallery?.querySelectorAll("img") || [])];
          const galleryCaptions = [...(gallery?.querySelectorAll("figcaption") || [])];
          const h2Texts = [...(main?.querySelectorAll("h2") || [])]
            .map((heading) => normalize(heading.textContent));
          const bodyHrefs = [...(main?.querySelectorAll("a[href]") || [])]
            .map((anchor) => anchor.getAttribute("href"));
          const imagePairs = galleryImages.map((image) => ({
            src: image.getAttribute("src") || "",
            alt: image.getAttribute("alt")?.trim() || "",
          }));
          const figuresHaveDirectMediaAndCaption = figures.every((figure) =>
            figure.querySelectorAll(":scope > picture").length === 1 &&
            figure.querySelectorAll(":scope > figcaption").length === 1 &&
            figure.querySelectorAll("img").length === 1
          );
          const galleryImagesLoaded = galleryImages.every((image) =>
            image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
          );
          const galleryImagesHaveDimensions = galleryImages.every((image) =>
            Number.parseInt(image.getAttribute("width") || "", 10) > 0 &&
            Number.parseInt(image.getAttribute("height") || "", 10) > 0
          );
          const overflow =
            document.documentElement.scrollWidth - document.documentElement.clientWidth;
          const heroButton = heroButtons[0];

          activeCityGalleryContract = {
            city: activeCityGallery.city,
            h2Texts,
            internalAnchors: bodyHrefs,
            heroButtonCount: heroButtons.length,
            heroScrollTarget:
              heroButton?.getAttribute("data-hero-scroll-target") || null,
            heroAriaControls: heroButton?.getAttribute("aria-controls") || null,
            heroAnchorCount: hero?.querySelectorAll("a").length || 0,
            galleryFigureCount: figures.length,
            galleryImageCount: galleryImages.length,
            galleryCaptionCount: galleryCaptions.length,
            galleryAnchorCount: gallerySection?.querySelectorAll("a").length || 0,
            uniqueGalleryImageCount:
              new Set(galleryImages.map((image) => image.getAttribute("src"))).size,
            galleryCaptionsPass: galleryCaptions.every(
              (caption) => Boolean(normalize(caption.textContent)),
            ),
            figuresHaveDirectMediaAndCaption,
            galleryImagesLoaded,
            galleryImagesHaveDimensions,
            imagePairs,
            overflow,
            pass:
              JSON.stringify(h2Texts) === JSON.stringify(activeCityGallery.h2Texts) &&
              JSON.stringify(bodyHrefs) ===
                JSON.stringify(activeCityGallery.internalAnchors) &&
              heroButtons.length === 1 &&
              heroButton?.getAttribute("data-hero-scroll-target") ===
                activeCityGallery.finalId &&
              heroButton?.getAttribute("aria-controls") === activeCityGallery.finalId &&
              (hero?.querySelectorAll("a").length || 0) === 0 &&
              figures.length === activeCityGallery.figureCount &&
              galleryImages.length === activeCityGallery.figureCount &&
              galleryCaptions.length === activeCityGallery.figureCount &&
              galleryCaptions.every(
                (caption) => Boolean(normalize(caption.textContent)),
              ) &&
              figuresHaveDirectMediaAndCaption &&
              (gallerySection?.querySelectorAll("a").length || 0) === 0 &&
              new Set(galleryImages.map((image) => image.getAttribute("src"))).size ===
                activeCityGallery.figureCount &&
              imagePairs.every((image) => Boolean(image.alt)) &&
              JSON.stringify(imagePairs) === JSON.stringify(activeCityGallery.images) &&
              galleryImagesLoaded &&
              galleryImagesHaveDimensions &&
              overflow <= 0,
          };
        }
        let pascoContract = null;
        if (location.pathname === "/pasco-wa-photographer/") {
          const main = document.querySelector("main");
          const hero = main?.querySelector('[data-editorial-hero-page="pasco"]');
          const directory = main?.querySelector("#pasco-session-directory");
          const gallery = main?.querySelector("#recent-pasco-sessions");
          const faq = main?.querySelector("#pasco-questions");
          const galleryImages = [...(gallery?.querySelectorAll("img") || [])];
          const visibleFaq = [...(faq?.querySelectorAll("details") || [])].map((detail) => ({
            question: normalize(detail.querySelector("h3")?.textContent || detail.querySelector("summary")?.textContent),
            answer: normalize(detail.querySelector("summary")?.nextElementSibling?.textContent),
          }));
          const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
            .map((script) => {
              try {
                return JSON.parse(script.textContent || "");
              } catch {
                return null;
              }
            });
          const services = schemas.filter((schema) => schema?.["@type"] === "Service");
          const faqSchemas = schemas.filter((schema) => schema?.["@type"] === "FAQPage");
          const webPages = schemas.filter((schema) => schema?.["@type"] === "WebPage");
          const breadcrumbs = schemas.filter((schema) => schema?.["@type"] === "BreadcrumbList");
          const faqEntities = faqSchemas[0]?.mainEntity || [];
          const expectedH2 = [
            "The Most Underrated Light in the Tri-Cities",
            "Where Two Rivers Meet",
            "Farmland, Rows and Long Horizons",
            "What I Photograph in Pasco",
            "Recent Pasco Sessions",
            "Seasons in Pasco",
            "Pasco Questions",
            "Let's Find Your Light",
          ];
          const expectedLinks = [
            "/about/",
            "/journal/family-photo-locations-tri-cities/",
            "/senior-photographer-tri-cities-wa/",
            "/family-photographer-tri-cities-wa/",
            "/newborn-photographer-tri-cities-wa/",
            "/branding-photographer-tri-cities-wa/",
            "/headshot-photographer-tri-cities-wa/",
            "/contact/",
          ];
          const h1Texts = [...(main?.querySelectorAll("h1") || [])].map((heading) => normalize(heading.textContent));
          const h2Texts = [...(main?.querySelectorAll("h2") || [])].map((heading) => normalize(heading.textContent));
          const directoryHrefs = [...(directory?.querySelectorAll("a[href]") || [])]
            .map((anchor) => anchor.getAttribute("href"));
          const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
          const faqMatchesSchema =
            visibleFaq.length === 4 &&
            faqSchemas.length === 1 &&
            faqEntities.length === 4 &&
            visibleFaq.every(
              (item, index) =>
                item.question === faqEntities[index]?.name &&
                item.answer === faqEntities[index]?.acceptedAnswer?.text,
            );
          const schemaPass =
            services.length === 1 &&
            services[0]?.serviceType === "Portrait photography" &&
            services[0]?.areaServed?.name === "Pasco" &&
            webPages.length === 1 &&
            webPages[0]?.spatialCoverage?.name === "Pasco" &&
            breadcrumbs.length === 1 &&
            breadcrumbItems.length === 2 &&
            breadcrumbItems[0]?.name === "Home" &&
            breadcrumbItems[1]?.name === "Pasco Photographer";
          pascoContract = {
            h1Texts,
            h2Texts,
            heroCtaTag: hero?.querySelector("[data-hero-cta]")?.tagName || null,
            heroScrollTarget: hero?.querySelector("[data-hero-cta]")?.getAttribute("data-hero-scroll-target") || null,
            heroAnchorCount: hero?.querySelectorAll("a").length || 0,
            heroScriptCount: hero?.querySelectorAll("[data-hero-script]").length || 0,
            directoryHrefs,
            galleryFigureCount: gallery?.querySelectorAll("figure").length || 0,
            galleryImageCount: galleryImages.length,
            uniqueGalleryImageCount: new Set(galleryImages.map((image) => image.getAttribute("src"))).size,
            galleryAltsPass: galleryImages.every((image) => Boolean(image.getAttribute("alt")?.trim())),
            visibleFaqCount: visibleFaq.length,
            faqSchemaCount: faqSchemas.length,
            faqEntityCount: faqEntities.length,
            faqMatchesSchema,
            serviceSchemaCount: services.length,
            schemaPass,
            pass:
              JSON.stringify(h1Texts) === JSON.stringify(["Pasco, WA Photographer"]) &&
              JSON.stringify(h2Texts) === JSON.stringify(expectedH2) &&
              JSON.stringify(internalBodyLinks.map((anchor) => anchor.getAttribute("href"))) === JSON.stringify(expectedLinks) &&
              hero?.querySelector("[data-hero-cta]")?.tagName === "BUTTON" &&
              hero?.querySelector("[data-hero-cta]")?.getAttribute("data-hero-scroll-target") === "pasco-final" &&
              (hero?.querySelectorAll("a").length || 0) === 0 &&
              (hero?.querySelectorAll("[data-hero-script]").length || 0) === 0 &&
              JSON.stringify(directoryHrefs) === JSON.stringify(expectedLinks.slice(2, 7)) &&
              (gallery?.querySelectorAll("figure").length || 0) === 10 &&
              galleryImages.length === 10 &&
              new Set(galleryImages.map((image) => image.getAttribute("src"))).size === 10 &&
              galleryImages.every((image) => Boolean(image.getAttribute("alt")?.trim())) &&
              faqMatchesSchema &&
              schemaPass,
          };
        }
        return {
          title: document.title,
          canonical: document.querySelector('link[rel="canonical"]')?.href || null,
          robots: document.querySelector('meta[name="robots"]')?.content || null,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          internalBodyLinkCount: internalBodyLinks.length,
          internalBodyLinks: internalBodyLinks.map((anchor) => anchor.getAttribute("href")),
          minBodyFontPx: textSizes.length ? Math.min(...textSizes) : null,
          signature:
            content?.getAttribute("data-signature-device") ||
            (document.querySelector("main.homepage") ? "overlap" : null) ||
            (document.querySelector(".journal-section") ? "overlap" : null),
          placeholderLeak: /\[(?:insert|placeholder|price|date|url|link|number|confirm|name)[^\]]*\]/i.test(document.querySelector("main")?.innerText || ""),
          brokenImages: images.filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0),
          imagesWithoutDimensions: images.filter((image) => !image.width || !image.height).map((image) => image.src),
          currentNavLinks: [...document.querySelectorAll('.primary-nav a[aria-current="page"]')].map((anchor) => anchor.getAttribute("href")),
          activeCityGalleryContract,
          pascoContract,
        };
      }, activeCityGallery);

      let activeCityHeroBehavior = null;
      if (activeCityGallery) {
        const heroButton = page.locator(
          `[data-editorial-hero-page="${activeCityGallery.pageKey}"] button[data-hero-cta]`,
        );
        const finalTarget = page.locator(`#${activeCityGallery.finalId}`);
        const heroButtonCount = await heroButton.count();
        const finalTargetCount = await finalTarget.count();
        let clickError = null;
        let state = null;

        if (heroButtonCount === 1 && finalTargetCount === 1) {
          try {
            await heroButton.click();
            state = await finalTarget.evaluate((target) => {
              const rect = target.getBoundingClientRect();
              return {
                focused: document.activeElement === target,
                visibleAfterClick: rect.bottom > 0 && rect.top < window.innerHeight,
                targetTop: rect.top,
                scrollY: window.scrollY,
              };
            });
          } catch (error) {
            clickError = error instanceof Error ? error.message : String(error);
          }
        }

        activeCityHeroBehavior = {
          heroButtonCount,
          finalTargetCount,
          clickError,
          ...state,
          pass:
            heroButtonCount === 1 &&
            finalTargetCount === 1 &&
            !clickError &&
            state?.focused === true &&
            state?.visibleAfterClick === true,
        };

        await page.evaluate(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          window.scrollTo(0, 0);
        });
      }

      report.push({
        id,
        pathname,
        viewport,
        status: response?.status() || null,
        ...checks,
        currentNavMatches: JSON.stringify(checks.currentNavLinks) === JSON.stringify(
          pathname.startsWith("/journal/")
            ? ["/journal/"]
            : primaryPaths.has(pathname)
              ? [pathname]
              : []
        ),
        menu,
        focus,
        activeCityHeroBehavior,
        consoleErrors,
        failedRequests,
      });

      page.off("console", onConsole);
      page.off("requestfailed", onRequestFailed);
    }
  }

  const failures = report.filter((result) =>
    result.status !== 200 ||
    result.overflow > 0 ||
    (expandedDirectoryLinkCounts.has(result.pathname)
      ? result.internalBodyLinkCount !== expandedDirectoryLinkCounts.get(result.pathname)
      : result.internalBodyLinkCount > 4) ||
    (activeCityGalleryContracts[result.pathname] &&
      (!result.activeCityGalleryContract?.pass || !result.activeCityHeroBehavior?.pass)) ||
    (result.pathname === "/pasco-wa-photographer/" && !result.pascoContract?.pass) ||
    (result.minBodyFontPx !== null && result.minBodyFontPx < 16) ||
    !result.signature ||
    result.placeholderLeak ||
    result.brokenImages.length > 0 ||
    result.imagesWithoutDimensions.length > 0 ||
    result.consoleErrors.length > 0 ||
    result.failedRequests.length > 0 ||
    !result.robots?.includes("noindex") ||
    !result.currentNavMatches ||
    !result.focus?.visiblyOutlined ||
    (result.menu && (
      result.menu.opened !== "true" ||
      result.menu.outsideClosed !== "false" ||
      result.menu.closed !== "false" ||
      !result.menu.focusReturned ||
      result.menu.scrollLocked !== (Number.parseInt(result.viewport, 10) <= 1050)
    ))
  );

  return {
    screenshotCount: report.length,
    routeCount: routes.length,
    viewportCount: viewports.length,
    failureCount: failures.length,
    failures,
    routeSummary: routes.map(([id, pathname]) => ({
      id,
      pathname,
      screenshots: viewports.map(([viewport]) => `artifacts/qa/${id}/${viewport}.png`),
    })),
  };
}
