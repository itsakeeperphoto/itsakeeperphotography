async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const routes = [
    {
      id: "branding",
      path: "/branding-photographer-tri-cities-wa/",
      root: ".branding-page",
      minimumUnique: 10,
      expectedCount: 13,
      mosaic: [5, 9],
      triptych: [9, 12],
      sections: [
        "[data-editorial-hero-page='branding']",
        "[data-branding-section='people']",
        "[data-branding-section='custom']",
        "[data-branding-section='audiences']",
        "[data-branding-final]",
      ],
    },
    {
      id: "headshots",
      path: "/headshot-photographer-tri-cities-wa/",
      root: ".headshot-page",
      minimumUnique: 10,
      expectedCount: 14,
      teams: [9, 11],
      sections: [
        "[data-editorial-hero-page='headshots']",
        ".headshot-studio",
        ".headshot-useful",
        ".headshot-guided",
        ".headshot-teams",
        ".headshot-final",
      ],
    },
  ];
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const results = [];

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.unroute("**/*");
  for (const analyticsPattern of [
    "https://www.google-analytics.com/**",
    "https://www.googletagmanager.com/**",
    "https://www.clarity.ms/**",
  ]) {
    await page.route(analyticsPattern, (route) =>
      route.fulfill({ status: 204, body: "" }),
    );
  }

  for (const route of routes) {
    for (const viewport of viewports) {
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      const failedResponses = [];
      const onConsole = (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onPageError = (error) => pageErrors.push(error.message);
      const onRequestFailed = (request) =>
        failedRequests.push(
          `${request.method()} ${request.url()} — ${request.failure()?.errorText || "failed"}`,
        );
      const onResponse = (response) => {
        if (response.status() >= 400) {
          failedResponses.push(`${response.status()} ${response.url()}`);
        }
      };

      page.on("console", onConsole);
      page.on("pageerror", onPageError);
      page.on("requestfailed", onRequestFailed);
      page.on("response", onResponse);

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(`${baseUrl}${route.path}`, {
        waitUntil: "networkidle",
      });

      for (const selector of route.sections) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(50);
      }
      await page.evaluate(async (rootSelector) => {
        const root = document.querySelector(rootSelector);
        await Promise.all(
          [...(root?.querySelectorAll("img") || [])].map((image) =>
            image.decode().catch(() => undefined),
          ),
        );
        window.scrollTo(0, 0);
      }, route.root);
      await page.waitForTimeout(80);

      const metrics = await page.evaluate(
        ({ rootSelector, expectedCount, minimumUnique, mosaic, triptych, teams }) => {
          const root = document.querySelector(rootSelector);
          const images = [...root.querySelectorAll("img")].map((image) => {
            const box = image.getBoundingClientRect();
            const picture = image.closest("picture");
            return {
              src: image.getAttribute("src") || "",
              alt: image.getAttribute("alt") || "",
              currentSrc: image.currentSrc || image.src,
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
              renderedWidth: box.width,
              renderedHeight: box.height,
              width: Number(image.getAttribute("width")),
              height: Number(image.getAttribute("height")),
              loading: image.getAttribute("loading"),
              decoding: image.getAttribute("decoding"),
              fetchpriority: image.getAttribute("fetchpriority"),
              objectFit: getComputedStyle(image).objectFit,
              hasWebpSource: [...(picture?.querySelectorAll("source") || [])].some(
                (source) => source.type === "image/webp" && source.srcset,
              ),
            };
          });
          const usage = images.reduce((map, image) => {
            map[image.src] = (map[image.src] || 0) + 1;
            return map;
          }, {});
          const rangeIsUnique = (range) =>
            !range ||
            new Set(images.slice(range[0], range[1]).map((image) => image.src)).size ===
              range[1] - range[0];
          const imageFailures = images
            .map((image, index) => {
              const failures = [];
              if (!image.complete) failures.push("incomplete");
              if (image.naturalWidth <= 0 || image.naturalHeight <= 0) failures.push("broken");
              if (image.renderedWidth <= 0 || image.renderedHeight <= 0) failures.push("not-rendered");
              if (image.width <= 0 || image.height <= 0) failures.push("missing-intrinsic-size");
              const selectedWidth = Number(
                new URL(image.currentSrc).pathname.match(/-(\d+)\.webp$/)?.[1] || 0,
              );
              if (selectedWidth < image.renderedWidth * 0.88) failures.push("undersized-source");
              if (image.objectFit !== "cover") failures.push("object-fit");
              if (!image.hasWebpSource) failures.push("missing-webp-source");
              if (!/\.webp(?:$|\?)/.test(new URL(image.currentSrc).pathname)) {
                failures.push("non-webp-current-source");
              }
              if (image.alt && (image.alt.length < 10 || image.alt.length > 125)) {
                failures.push("alt-length");
              }
              return failures.length ? { index, failures, ...image } : null;
            })
            .filter(Boolean);
          const imagePass = imageFailures.length === 0;
          const loadingPass = images.every((image, index) =>
            index < 3
              ? image.loading === "eager" && image.decoding === "async"
              : image.loading === "lazy" && image.decoding === "async",
          );

          return {
            imageCount: images.length,
            uniqueCount: Object.keys(usage).length,
            maximumUse: Math.max(...Object.values(usage)),
            currentSources: images.map((image) => image.currentSrc),
            imageFailures,
            imagePass,
            loadingPass,
            heroPriority:
              images[0]?.fetchpriority === "high" &&
              images.slice(1).every((image) => image.fetchpriority !== "high"),
            heroFinalDistinct: images[0]?.src !== images.at(-1)?.src,
            rangePass:
              rangeIsUnique(mosaic) && rangeIsUnique(triptych) && rangeIsUnique(teams),
            countPass:
              images.length === expectedCount &&
              Object.keys(usage).length >= minimumUnique &&
              Math.max(...Object.values(usage)) <= 2,
            noHorizontalOverflow:
              document.documentElement.scrollWidth <= window.innerWidth + 1,
          };
        },
        {
          rootSelector: route.root,
          expectedCount: route.expectedCount,
          minimumUnique: route.minimumUnique,
          mosaic: route.mosaic,
          triptych: route.triptych,
          teams: route.teams,
        },
      );

      for (const [index, selector] of route.sections.entries()) {
        await page.locator(selector).screenshot({
          path: `.artifacts/service-media-refresh/${route.id}-${viewport.id}-${index + 1}.png`,
          animations: "disabled",
        });
      }

      const result = {
        route: route.id,
        viewport: viewport.id,
        status: response?.status() || 0,
        consoleErrors,
        pageErrors,
        failedRequests: failedRequests.filter(
          (failure) => !failure.includes("https://www.google-analytics.com/g/collect"),
        ),
        failedResponses,
        ...metrics,
      };
      results.push(result);

      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
    }
  }

  const failures = results.filter(
    (result) =>
      result.status !== 200 ||
      result.consoleErrors.length ||
      result.pageErrors.length ||
      result.failedRequests.length ||
      result.failedResponses.length ||
      !result.imagePass ||
      !result.loadingPass ||
      !result.heroPriority ||
      !result.heroFinalDistinct ||
      !result.rangePass ||
      !result.countPass ||
      !result.noHorizontalOverflow,
  );
  if (failures.length) {
    throw new Error(`Service media QA failed: ${JSON.stringify(failures, null, 2)}`);
  }

  return results;
}
