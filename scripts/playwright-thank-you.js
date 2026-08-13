async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/thank-you/";
  const releaseOrigin = "https://www.itsakeeperphotography.com";
  const artifactRoot = ".artifacts/thank-you-2026-08-13/final";
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const expected = {
    title: "Thank You | It's A Keeper Photography",
    description:
      "Your photography inquiry is with Lisa. She reads every message herself and replies personally.",
    h1: ["Thank You for Reaching Out"],
    h2: [
      "Your Message Is With Me",
      "What Happens Next",
      "A Little More Light, While You Wait",
    ],
    h3: ["Read with Care", "A Personal Reply", "Plan Together"],
  };

  const failures = [];
  const results = [];
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const viewport of viewports) {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const failedResponses = [];
    const onConsole = (message) => {
      if (
        message.type() === "error" &&
        !/(?:clarity\.ms|googletagmanager\.com|google-analytics\.com)/i.test(
          message.text(),
        )
      ) {
        consoleErrors.push(message.text());
      }
    };
    const onPageError = (error) => pageErrors.push(error.message);
    const onRequestFailed = (request) => {
      if (request.url().startsWith(baseUrl)) {
        failedRequests.push(
          `${request.method()} ${request.url()} — ${request.failure()?.errorText || "failed"}`,
        );
      }
    };
    const onResponse = (response) => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) {
        failedResponses.push(`${response.status()} ${response.url()}`);
      }
    };
    page.on("console", onConsole);
    page.on("pageerror", onPageError);
    page.on("requestfailed", onRequestFailed);
    page.on("response", onResponse);

    try {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });
      if (!response?.ok()) failures.push(`${viewport.id}: route returned ${response?.status()}`);
      await page.locator(".thank-you-page").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1_500);

      const initial = await page.evaluate((expected) => {
        const normalize = (value) => value?.replace(/\s+/g, " ").trim() || "";
        const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((node) => {
            try {
              return JSON.parse(node.textContent || "{}");
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        const mainAnchors = [...document.querySelectorAll("main a")].map((anchor) => ({
          href: anchor.getAttribute("href"),
          label: normalize(anchor.textContent),
        }));
        const hero = document.querySelector(".editorial-hero")?.getBoundingClientRect();
        const header = document.querySelector(".site-header")?.getBoundingClientRect();
        const portfolio = document.querySelector(".thank-you-close .outline-button");
        const portfolioStyle = portfolio ? getComputedStyle(portfolio) : null;
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
          robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          h1: [...document.querySelectorAll("main h1")].map((node) =>
            normalize(node.getAttribute("aria-label") || node.textContent),
          ),
          h2: [...document.querySelectorAll("main h2")].map((node) => normalize(node.textContent)),
          h3: [...document.querySelectorAll("main h3")].map((node) => normalize(node.textContent)),
          mainAnchors,
          heroHeight: hero?.height || 0,
          headerHeight: header?.height || 0,
          heroPrints: document.querySelectorAll(".editorial-hero__print").length,
          heroButtonTarget: document
            .querySelector("[data-hero-scroll-target]")
            ?.getAttribute("data-hero-scroll-target"),
          heroButtonLabel: normalize(
            document.querySelector("[data-hero-scroll-target]")?.textContent,
          ),
          signature: document.querySelector(".thank-you-page")?.getAttribute("data-signature-device"),
          imageCount: document.querySelectorAll(".thank-you-page img").length,
          hasForm: Boolean(document.querySelector("main form")),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          directionFirst:
            document.body.firstChild?.nodeType === Node.COMMENT_NODE &&
            (document.body.firstChild.textContent || "").includes("surface seed 02ea6a91"),
          webPageSchemas: schemas.filter((schema) => schema?.["@type"] === "WebPage").length,
          breadcrumbSchemas: schemas.filter((schema) => schema?.["@type"] === "BreadcrumbList").length,
          portfolioHeight: portfolio?.getBoundingClientRect().height || 0,
          portfolioColor: portfolioStyle?.color || "",
          expected,
        };
      }, expected);

      if (
        initial.title !== expected.title ||
        initial.description !== expected.description ||
        initial.robots !== "noindex, nofollow, noarchive" ||
        initial.canonical !== `${releaseOrigin}${route}`
      ) {
        failures.push(`${viewport.id}: release metadata, canonical or robots contract failed`);
      }
      if (
        JSON.stringify(initial.h1) !== JSON.stringify(expected.h1) ||
        JSON.stringify(initial.h2) !== JSON.stringify(expected.h2) ||
        JSON.stringify(initial.h3) !== JSON.stringify(expected.h3)
      ) {
        failures.push(`${viewport.id}: heading hierarchy differs from the approved copy`);
      }
      if (
        JSON.stringify(initial.mainAnchors) !==
        JSON.stringify([{ href: "/portfolio/", label: "View the Portfolio" }]) ||
        initial.heroButtonTarget !== "your-message-is-with-me" ||
        initial.heroButtonLabel !== "What happens next"
      ) {
        failures.push(`${viewport.id}: main action contract is invalid`);
      }
      if (
        initial.heroPrints !== 2 ||
        initial.signature !== "arch" ||
        initial.imageCount !== 6 ||
        initial.hasForm ||
        initial.scrollWidth !== initial.clientWidth ||
        !initial.directionFirst ||
        initial.webPageSchemas !== 1 ||
        initial.breadcrumbSchemas !== 0 ||
        initial.portfolioHeight < 44
      ) {
        failures.push(`${viewport.id}: structure, responsive fit, schema or control-size gate failed`);
      }
      const expectedHeroHeight = viewport.width <= 767
        ? 656
        : Math.max(
            viewport.height - initial.headerHeight,
            viewport.width <= 1050 ? 688 : 736,
          );
      if (Math.abs(initial.heroHeight - expectedHeroHeight) > 1) {
        failures.push(
          `${viewport.id}: shared EditorialHero height differs (${initial.heroHeight} vs ${expectedHeroHeight})`,
        );
      }

      const heroButton = page.getByRole("button", { name: "What happens next" });
      await heroButton.click();
      await page.waitForTimeout(300);
      const focusedId = await page.evaluate(() => document.activeElement?.id || "");
      if (focusedId !== "your-message-is-with-me") {
        failures.push(`${viewport.id}: hero control did not focus the note section`);
      }

      const portfolio = page.getByRole("link", { name: "View the Portfolio" });
      await portfolio.scrollIntoViewIfNeeded();
      const beforeHover = await portfolio.evaluate((element) => ({
        color: getComputedStyle(element).color,
        background: getComputedStyle(element).backgroundColor,
      }));
      await portfolio.hover();
      await page.waitForTimeout(160);
      const afterHover = await portfolio.evaluate((element) => ({
        color: getComputedStyle(element).color,
        background: getComputedStyle(element).backgroundColor,
      }));
      if (
        beforeHover.color === afterHover.color ||
        beforeHover.background === afterHover.background
      ) {
        failures.push(`${viewport.id}: Portfolio CTA has no visible hover feedback`);
      }

      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < scrollHeight; y += Math.floor(viewport.height * 0.72)) {
        await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
        await page.waitForTimeout(100);
      }
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll(".thank-you-page img")].every(
            (image) => Boolean(image.currentSrc) && image.complete && image.naturalWidth > 0,
          ),
        null,
        { timeout: 10_000 },
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(350);
      await page.screenshot({
        path: `${artifactRoot}/thank-you-${viewport.id}.png`,
        fullPage: true,
      });

      results.push({
        viewport: viewport.id,
        heroHeight: initial.heroHeight,
        scrollHeight,
        imageCount: initial.imageCount,
        noHorizontalOverflow: initial.scrollWidth === initial.clientWidth,
      });
    } finally {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
      if (
        consoleErrors.length ||
        pageErrors.length ||
        failedRequests.length ||
        failedResponses.length
      ) {
        failures.push(
          `${viewport.id}: runtime errors ${JSON.stringify({ consoleErrors, pageErrors, failedRequests, failedResponses })}`,
        );
      }
    }
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1_200);
  const reducedMotion = await page.evaluate(() => {
    const selectors = [
      ".editorial-hero__copy",
      ".thank-you-note__copy",
      ".thank-you-note__arch",
      ".thank-you-next",
      ".thank-you-close__inner",
    ];
    return selectors.map((selector) => {
      const element = document.querySelector(selector);
      const style = element ? getComputedStyle(element) : null;
      return {
        selector,
        visible: Boolean(
          element &&
            style?.display !== "none" &&
            style?.visibility !== "hidden" &&
            Number.parseFloat(style?.opacity || "0") > 0,
        ),
        transform: style?.transform || "none",
      };
    });
  });
  if (reducedMotion.some((item) => !item.visible)) {
    failures.push(`reduced-motion: content is hidden ${JSON.stringify(reducedMotion)}`);
  }

  if (failures.length) {
    throw new Error(failures.join("\n"));
  }

  return { route, viewports: results, reducedMotion, status: "passed" };
}
