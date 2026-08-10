async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");
  const routes = [
    {
      id: "senior",
      path: "/senior-photographer-tri-cities-wa/",
      heading: "Senior Pictures in the Tri-Cities, WA",
      script: "this year",
    },
    {
      id: "family",
      path: "/family-photographer-tri-cities-wa/",
      heading: "Family Photographer in the Tri-Cities, WA",
      script: "this season",
    },
    {
      id: "newborn",
      path: "/newborn-photographer-tri-cities-wa/",
      heading: "Newborn Photographer in the Tri-Cities, WA",
      script: "keep the way this felt",
    },
    {
      id: "pasco",
      path: "/pasco-wa-photographer/",
      heading: "Pasco, WA Photographer",
      script: null,
    },
    {
      id: "about",
      path: "/about/",
      heading: "Meet Lisa — The Heart Behind It's A Keeper",
      script: "the heart behind every keeper",
    },
    {
      id: "branding",
      path: "/branding-photographer-tri-cities-wa/",
      heading: "Branding Photography for Tri-Cities Businesses",
      script: "your work",
    },
  ];
  const viewports = [
    { id: "1440x1000", width: 1440, height: 1000 },
    { id: "1200x900", width: 1200, height: 900 },
    { id: "900x900", width: 900, height: 900 },
    { id: "390x844", width: 390, height: 844 },
  ];
  const results = [];

  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    for (const route of routes) {
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      const onConsole = (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onPageError = (error) => pageErrors.push(error.message);
      const onRequestFailed = (request) => {
        failedRequests.push(
          `${request.method()} ${request.url()} — ${request.failure()?.errorText || "failed"}`,
        );
      };

      page.on("console", onConsole);
      page.on("pageerror", onPageError);
      page.on("requestfailed", onRequestFailed);

      const response = await page.goto(`${baseUrl}${route.path}`, {
        waitUntil: "networkidle",
      });
      const hero = page.locator("[data-editorial-hero]");
      await hero.waitFor({ state: "visible" });
      await page.evaluate(async () => {
        await Promise.all(
          [...document.querySelectorAll("[data-editorial-hero] img")].map(
            (image) => image.decode().catch(() => undefined),
          ),
        );
      });

      await page.screenshot({
        path: `.artifacts/hero-centralization/final/${route.id}-${viewport.id}.png`,
        animations: "disabled",
        scale: "css",
      });
      await hero.screenshot({
        path: `.artifacts/hero-centralization/final/${route.id}-${viewport.id}-hero.png`,
        animations: "disabled",
        scale: "css",
      });

      const cta = hero.locator("[data-hero-cta]");
      if (await cta.count()) await cta.focus();
      await page.waitForTimeout(60);

      const metrics = await page.evaluate(
        ({ expectedHeading, expectedScript }) => {
          const hero = document.querySelector("[data-editorial-hero]");
          const background = hero?.querySelector("[data-hero-background] img");
          const copy = hero?.querySelector("[data-hero-copy]");
          const script = hero?.querySelector("[data-hero-script]");
          const title = hero?.querySelector("[data-hero-title]");
          const intro = hero?.querySelector("[data-hero-intro]");
          const cta = hero?.querySelector("[data-hero-cta]");
          const edge = hero?.querySelector("[data-hero-paper-edge]");
          const prints = [...(hero?.querySelectorAll("[data-hero-print]") || [])];
          const images = [...(hero?.querySelectorAll("img") || [])];
          const rect = (element) => {
            const box = element?.getBoundingClientRect();
            return box
              ? {
                  x: Math.round(box.x * 100) / 100,
                  y: Math.round(box.y * 100) / 100,
                  width: Math.round(box.width * 100) / 100,
                  height: Math.round(box.height * 100) / 100,
                  right: Math.round(box.right * 100) / 100,
                  bottom: Math.round(box.bottom * 100) / 100,
                }
              : null;
          };
          const style = (element, fields) => {
            if (!element) return null;
            const computed = getComputedStyle(element);
            return Object.fromEntries(fields.map((field) => [field, computed[field]]));
          };
          const heroBox = rect(hero);
          const titleBox = rect(title);
          const ctaBox = rect(cta);
          const activeAnimations = hero
            ?.getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length;

          return {
            hero: heroBox,
            heroStyle: style(hero, [
              "display",
              "minHeight",
              "placeItems",
              "isolation",
              "overflow",
            ]),
            backgroundStyle: style(background, [
              "objectFit",
              "objectPosition",
              "filter",
            ]),
            copy: rect(copy),
            copyStyle: style(copy, ["width", "padding", "textAlign"]),
            title: titleBox,
            titleStyle: style(title, [
              "fontFamily",
              "fontSize",
              "fontWeight",
              "letterSpacing",
              "lineHeight",
              "textTransform",
            ]),
            scriptStyle: style(script, [
              "fontFamily",
              "fontSize",
              "fontWeight",
              "letterSpacing",
              "lineHeight",
              "transform",
            ]),
            introStyle: style(intro, [
              "fontFamily",
              "fontSize",
              "fontStyle",
              "lineHeight",
              "marginTop",
              "maxWidth",
            ]),
            cta: ctaBox,
            ctaTag: cta?.tagName || null,
            ctaScrollTarget: cta?.getAttribute("data-hero-scroll-target") || null,
            heroAnchorCount: hero?.querySelectorAll("a").length || 0,
            ctaStyle: style(cta, [
              "fontFamily",
              "fontSize",
              "letterSpacing",
              "minHeight",
              "outlineStyle",
              "outlineWidth",
              "outlineOffset",
            ]),
            printCount: prints.length,
            prints: prints.map((print) => ({
              side: print.getAttribute("data-hero-print"),
              rect: rect(print),
              style: style(print, [
                "bottom",
                "padding",
                "transform",
                "backgroundColor",
              ]),
            })),
            edgeStyle: style(edge, ["height", "clipPath", "bottom"]),
            h1Count: hero?.querySelectorAll("h1").length || 0,
            labelledByMatches:
              hero?.getAttribute("aria-labelledby") === title?.getAttribute("id"),
            accessibleHeadingMatches:
              title?.getAttribute("aria-label") === expectedHeading,
            scriptMatches:
              expectedScript === null
                ? script === null
                : script?.textContent?.trim() === expectedScript,
            titleInsideViewport:
              !!titleBox && titleBox.x >= -1 && titleBox.right <= innerWidth + 1,
            ctaTargetPass:
              !!ctaBox && ctaBox.width >= 44 && ctaBox.height >= 44,
            focusVisible:
              !!cta &&
              (getComputedStyle(cta).outlineStyle !== "none" ||
                getComputedStyle(cta).boxShadow !== "none"),
            imageCount: images.length,
            brokenImages: images
              .filter(
                (image) =>
                  !image.complete ||
                  image.naturalWidth === 0 ||
                  image.naturalHeight === 0,
              )
              .map((image) => image.currentSrc || image.src),
            decorativePrintAltsPass: prints.every(
              (print) =>
                print.getAttribute("aria-hidden") === "true" &&
                [...print.querySelectorAll("img")].every(
                  (image) => image.getAttribute("alt") === "",
                ),
            ),
            overflow:
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
            reducedMotion: matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches,
            activeAnimations,
          };
        },
        {
          expectedHeading: route.heading,
          expectedScript: route.script,
        },
      );

      results.push({
        route: route.id,
        viewport: viewport.id,
        status: response?.status() || null,
        consoleErrors,
        pageErrors,
        failedRequests,
        ...metrics,
      });

      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
    }
  }

  const geometryFields = [
    "heroStyle",
    "copyStyle",
    "titleStyle",
    "scriptStyle",
    "introStyle",
    "edgeStyle",
  ];
  const geometryMismatches = [];
  for (const viewport of viewports) {
    const baseline = results.find(
      (result) =>
        result.route === "senior" && result.viewport === viewport.id,
    );
    for (const result of results.filter(
      (candidate) =>
        candidate.viewport === viewport.id && candidate.route !== "senior",
    )) {
      for (const field of geometryFields) {
        if (
          JSON.stringify(result[field]) !== JSON.stringify(baseline[field])
        ) {
          geometryMismatches.push({
            viewport: viewport.id,
            route: result.route,
            field,
            expected: baseline[field],
            received: result[field],
          });
        }
      }
      if (
        JSON.stringify(result.prints.map((print) => print.style)) !==
        JSON.stringify(baseline.prints.map((print) => print.style))
      ) {
        geometryMismatches.push({
          viewport: viewport.id,
          route: result.route,
          field: "printStyles",
        });
      }
    }
  }

  const failures = results.filter(
    (result) =>
      result.status !== 200 ||
      result.consoleErrors.length > 0 ||
      result.pageErrors.length > 0 ||
      result.failedRequests.length > 0 ||
      result.overflow > 1 ||
      result.h1Count !== 1 ||
      !result.labelledByMatches ||
      !result.accessibleHeadingMatches ||
      !result.scriptMatches ||
      !result.titleInsideViewport ||
      !result.ctaTargetPass ||
      !result.focusVisible ||
      result.printCount !== 2 ||
      result.brokenImages.length > 0 ||
      !result.decorativePrintAltsPass ||
      (result.route === "pasco" && (
        result.ctaTag !== "BUTTON" ||
        result.ctaScrollTarget !== "pasco-final" ||
        result.heroAnchorCount !== 0
      )) ||
      !result.reducedMotion ||
      result.activeAnimations > 0,
  );

  return {
    screenshotCount: results.length * 2,
    resultCount: results.length,
    failureCount: failures.length,
    geometryMismatchCount: geometryMismatches.length,
    failures,
    geometryMismatches,
    results,
  };
}
