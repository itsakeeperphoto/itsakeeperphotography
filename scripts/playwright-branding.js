async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");
  const route = "/branding-photographer-tri-cities-wa/";
  const artifactDir = ".artifacts/branding-redesign/final";
  const viewports = [
    { id: "1440x1000", width: 1440, height: 1000 },
    { id: "1200x900", width: 1200, height: 900 },
    { id: "900x900", width: 900, height: 900 },
    { id: "390x844", width: 390, height: 844 },
  ];
  const results = [];

  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const failedResponses = [];
    const onConsole = (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    const onPageError = (error) => pageErrors.push(error.message);
    const onRequestFailed = (request) => {
      failedRequests.push(
        `${request.method()} ${request.url()} — ${
          request.failure()?.errorText || "failed"
        }`,
      );
    };
    const onResponse = (response) => {
      if (response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    };

    page.on("console", onConsole);
    page.on("pageerror", onPageError);
    page.on("requestfailed", onRequestFailed);
    page.on("response", onResponse);

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle",
    });

    const sections = [
      "[data-editorial-hero-page='branding']",
      "[data-branding-section='face']",
      "[data-branding-section='library']",
      "[data-branding-section='includes']",
      "[data-branding-section='audiences']",
      "[data-branding-faq]",
      "[data-branding-final]",
    ];
    for (const selector of sections) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
    }
    await page.evaluate(async () => {
      await Promise.all(
        [...document.querySelectorAll("[data-branding-page] img")].map(
          (image) => image.decode().catch(() => undefined),
        ),
      );
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(80);

    const focusResults = [];
    const focusables = page.locator(
      "[data-branding-page] a[href], [data-branding-page] summary",
    );
    for (let index = 0; index < (await focusables.count()); index += 1) {
      const target = focusables.nth(index);
      if (!(await target.isVisible())) continue;
      await target.focus();
      focusResults.push(
        await target.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
            focusVisible: element.matches(":focus-visible"),
            visibleIndicator:
              (style.outlineStyle !== "none" &&
                parseFloat(style.outlineWidth) >= 2 &&
                style.outlineColor !== "rgba(0, 0, 0, 0)") ||
              style.boxShadow !== "none",
          };
        }),
      );
    }

    const secondSummary = page.locator(".branding-faq__item summary").nth(1);
    await secondSummary.focus();
    const initiallyOpen = await secondSummary.evaluate(
      (element) => element.parentElement?.hasAttribute("open") || false,
    );
    await page.keyboard.press("Enter");
    const toggledWithKeyboard = await secondSummary.evaluate(
      (element, wasOpen) =>
        (element.parentElement?.hasAttribute("open") || false) !== wasOpen,
      initiallyOpen,
    );
    await page.keyboard.press("Enter");
    await secondSummary.evaluate((element) => element.blur());

    const metrics = await page.evaluate(({ viewportWidth }) => {
      const root = document.querySelector("[data-branding-page]");
      const rect = (element) => {
        const box = element?.getBoundingClientRect();
        return box
          ? {
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
              right: box.right,
              bottom: box.bottom,
            }
          : null;
      };
      const intersects = (a, b) =>
        a &&
        b &&
        a.x < b.right &&
        a.right > b.x &&
        a.y < b.bottom &&
        a.bottom > b.y;
      const internalLinks = [...root.querySelectorAll("a[href]")]
        .filter((anchor) => {
          const raw = anchor.getAttribute("href") || "";
          if (
            !raw ||
            raw.startsWith("#") ||
            raw.startsWith("mailto:") ||
            raw.startsWith("tel:")
          ) {
            return false;
          }
          return new URL(raw, location.href).origin === location.origin;
        })
        .map((anchor) => new URL(anchor.href).pathname);

      const bodyNodes = [...root.querySelectorAll("p, li")]
        .filter((element) => {
          const text = element.textContent?.trim() || "";
          const className = String(element.className);
          const style = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return (
            text.length >= 40 &&
            !/(eyebrow|script|number|caption|mark)/i.test(className) &&
            box.width > 0 &&
            box.height > 0 &&
            style.visibility !== "hidden"
          );
        })
        .map((element) => ({
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
          size: parseFloat(getComputedStyle(element).fontSize),
        }));

      const images = [...root.querySelectorAll("img")].map((image) => {
        const box = image.getBoundingClientRect();
        const width = Number(image.getAttribute("width"));
        const height = Number(image.getAttribute("height"));
        const currentRatio = image.naturalWidth / image.naturalHeight;
        const attributeRatio = width / height;
        return {
          alt: image.getAttribute("alt"),
          currentSrc: image.currentSrc || image.src,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          renderedWidth: box.width,
          renderedHeight: box.height,
          hasDimensions: width > 0 && height > 0,
          ratioDelta: Math.abs(currentRatio - attributeRatio),
          objectFit: getComputedStyle(image).objectFit,
        };
      });

      const arch = rect(document.querySelector("[data-branding-arch='face']"));
      const facePrint = rect(document.querySelector(".branding-face__print"));
      const mosaicPhotos = [
        ...document.querySelectorAll("[data-branding-mosaic] [data-branding-photo]"),
      ];
      const processSteps = [
        ...document.querySelectorAll("[data-branding-step]"),
      ].map(rect);
      const processIntersections = [];
      for (let first = 0; first < processSteps.length; first += 1) {
        for (let second = first + 1; second < processSteps.length; second += 1) {
          if (intersects(processSteps[first], processSteps[second])) {
            processIntersections.push([first, second]);
          }
        }
      }

      const triptych = {
        left: rect(document.querySelector("[data-branding-panel='left']")),
        center: rect(document.querySelector("[data-branding-panel='center']")),
        right: rect(document.querySelector("[data-branding-panel='right']")),
      };
      const triptychDesktopPass =
        viewportWidth <= 767 ||
        (Math.max(
          triptych.left.width,
          triptych.center.width,
          triptych.right.width,
        ) -
          Math.min(
            triptych.left.width,
            triptych.center.width,
            triptych.right.width,
          ) <=
          triptych.center.width * 0.05 &&
          Math.max(
            triptych.left.bottom,
            triptych.center.bottom,
            triptych.right.bottom,
          ) -
            Math.min(
              triptych.left.bottom,
              triptych.center.bottom,
              triptych.right.bottom,
            ) <=
            2 &&
          (triptych.left.y - triptych.center.y) / triptych.center.height >=
            0.42 &&
          (triptych.left.y - triptych.center.y) / triptych.center.height <=
            0.55);

      const visibleHairlines = [
        ...root.querySelectorAll("[data-construction-line]"),
      ]
        .filter((line) => {
          const style = getComputedStyle(line);
          const box = line.getBoundingClientRect();
          return style.display !== "none" && box.width > 0 && box.height > 0;
        })
        .map((line) => {
          const box = rect(line);
          const thickness = Math.min(box.width, box.height);
          return {
            className: line.className,
            thickness,
          };
        });

      const faqList = document.querySelector(".branding-faq__list");
      const faqStyle = getComputedStyle(faqList);
      const hero = document.querySelector("[data-editorial-hero-page='branding']");
      const heroTitle = hero?.querySelector("[data-hero-title]");
      const heroPrints = [...(hero?.querySelectorAll("[data-hero-print]") || [])];
      const activeAnimations = root
        .getAnimations({ subtree: true })
        .filter((animation) => animation.playState === "running")
        .filter((animation) => {
          const keyframes = animation.effect?.getKeyframes?.() || [];
          const motionProperties = [
            "transform",
            "translate",
            "scale",
            "rotate",
            "top",
            "right",
            "bottom",
            "left",
            "clipPath",
            "filter",
            "opacity",
          ];
          return keyframes.some((frame) =>
            motionProperties.some((property) => property in frame),
          );
        }).length;

      return {
        contentStatus: root?.getAttribute("data-content-status"),
        signature: root?.getAttribute("data-signature-device"),
        robots: document.querySelector('meta[name="robots"]')?.content,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        internalLinks,
        bodyNodes,
        minimumBodySize: bodyNodes.length
          ? Math.min(...bodyNodes.map((node) => node.size))
          : 0,
        images,
        brokenImages: images.filter(
          (image) =>
            !image.complete ||
            image.naturalWidth === 0 ||
            image.naturalHeight === 0 ||
            !image.hasDimensions ||
            image.ratioDelta > 0.02 ||
            image.objectFit !== "cover" ||
            image.naturalWidth + Math.max(16, image.renderedWidth * 0.05) <
              image.renderedWidth,
        ),
        nonModernImages: images.filter(
          (image) => !/\.(?:webp|avif)(?:$|\?)/i.test(image.currentSrc),
        ),
        arch: {
          width: arch?.width,
          height: arch?.height,
          ratio: arch ? arch.width / arch.height : null,
          overlapX:
            arch && facePrint
              ? Math.max(0, Math.min(arch.right, facePrint.right) - Math.max(arch.x, facePrint.x))
              : 0,
          overlapY:
            arch && facePrint
              ? Math.max(0, Math.min(arch.bottom, facePrint.bottom) - Math.max(arch.y, facePrint.y))
              : 0,
        },
        mosaicPhotoCount: mosaicPhotos.length,
        processStepCount: processSteps.length,
        processIntersections,
        triptych,
        triptychDesktopPass,
        visibleHairlines,
        faqRailWidth: parseFloat(faqStyle.borderLeftWidth),
        faqBottomWidth: parseFloat(faqStyle.borderBottomWidth),
        h1Count: hero?.querySelectorAll("h1").length || 0,
        heroLabelledByPass:
          hero?.getAttribute("aria-labelledby") === heroTitle?.getAttribute("id"),
        heroAccessibleHeading:
          heroTitle?.getAttribute("aria-label") ===
          "Branding Photography for Tri-Cities Businesses",
        heroPrintCount: heroPrints.length,
        heroDecorativePrintsPass: heroPrints.every(
          (print) =>
            print.getAttribute("aria-hidden") === "true" &&
            [...print.querySelectorAll("img")].every(
              (image) => image.getAttribute("alt") === "",
            ),
        ),
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        activeAnimations,
        placeholderLeak:
          /\[(?:PENDIENTE|PENDING|VALIDAR|INSERT|PLACEHOLDER)[^\]]*\]|CONTENT PENDING|Q54|Q58/i.test(
            root.innerText,
          ),
      };
    }, { viewportWidth: viewport.width });

    const failures = [];
    if (response?.status() !== 200) failures.push(`status ${response?.status()}`);
    if (consoleErrors.length) failures.push("console errors");
    if (pageErrors.length) failures.push("page errors");
    if (failedRequests.length) failures.push("failed requests");
    if (failedResponses.length) failures.push("failed responses");
    if (metrics.contentStatus !== "draft") failures.push("draft gate");
    if (metrics.signature !== "overlap") failures.push("signature");
    if (!metrics.robots?.includes("noindex")) failures.push("robots");
    if (metrics.overflow > 1) failures.push("horizontal overflow");
    if (metrics.internalLinks.length > 4) failures.push("body link cap");
    if (
      JSON.stringify(metrics.internalLinks) !==
      JSON.stringify([
        "/contact/",
        "/reviews/",
        "/journal/branding-photos-vs-headshots/",
        "/contact/",
      ])
    ) {
      failures.push("body link sequence");
    }
    if (metrics.minimumBodySize < 16) failures.push("body type below 16px");
    if (metrics.brokenImages.length) failures.push("image load/crop");
    if (metrics.nonModernImages.length) failures.push("non-modern image source");
    if (
      metrics.arch.ratio < 0.82 ||
      metrics.arch.ratio > 0.86 ||
      metrics.arch.overlapX < 32 ||
      metrics.arch.overlapY < 48
    ) {
      failures.push("face composition");
    }
    if (metrics.mosaicPhotoCount !== 4) failures.push("mosaic count");
    if (
      metrics.processStepCount !== 3 ||
      metrics.processIntersections.length > 0
    ) {
      failures.push("process geometry");
    }
    if (!metrics.triptychDesktopPass) failures.push("triptych geometry");
    if (
      metrics.visibleHairlines.some(
        (line) => line.thickness < 0.75 || line.thickness > 1.25,
      )
    ) {
      failures.push("hairline thickness");
    }
    if (
      Math.abs(metrics.faqRailWidth - 1) > 0.1 ||
      Math.abs(metrics.faqBottomWidth - 1) > 0.1
    ) {
      failures.push("FAQ rail");
    }
    if (
      metrics.h1Count !== 1 ||
      !metrics.heroLabelledByPass ||
      !metrics.heroAccessibleHeading ||
      metrics.heroPrintCount !== 2 ||
      !metrics.heroDecorativePrintsPass
    ) {
      failures.push("shared hero contract");
    }
    if (
      !metrics.reducedMotion ||
      metrics.activeAnimations > 0
    ) {
      failures.push("reduced motion");
    }
    if (
      focusResults.some(
        (result) => !result.focusVisible || !result.visibleIndicator,
      )
    ) {
      failures.push("focus visibility");
    }
    if (!toggledWithKeyboard) failures.push("FAQ keyboard");
    if (metrics.placeholderLeak) failures.push("placeholder leak");

    await page.screenshot({
      path: `${artifactDir}/branding-${viewport.id}.png`,
      fullPage: true,
      animations: "disabled",
      scale: "css",
    });
    await page.locator("[data-editorial-hero-page='branding']").screenshot({
      path: `${artifactDir}/branding-${viewport.id}-hero.png`,
      animations: "disabled",
      scale: "css",
    });

    results.push({
      viewport: viewport.id,
      status: response?.status() || null,
      consoleErrors,
      pageErrors,
      failedRequests,
      failedResponses,
      focusResults,
      toggledWithKeyboard,
      failures,
      metrics,
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onRequestFailed);
    page.off("response", onResponse);
  }

  return {
    screenshotCount: viewports.length * 2,
    failureCount: results.filter((result) => result.failures.length).length,
    results,
  };
}
