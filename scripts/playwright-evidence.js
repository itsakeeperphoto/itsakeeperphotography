async (page) => {
  const baseUrl = "http://127.0.0.1:4321";
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
    ["portfolio", "/portfolio/"],
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
  const expandedDirectoryPaths = new Set([
    "/richland-wa-photographer/",
    "/kennewick-wa-photographer/",
  ]);
  const report = [];

  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const [id, pathname] of routes) {
    for (const [viewport, width, height] of viewports) {
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

      const checks = await page.evaluate(() => {
        const origin = location.origin;
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
          return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
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
        };
      });

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
    (expandedDirectoryPaths.has(result.pathname)
      ? result.internalBodyLinkCount !== 9
      : result.internalBodyLinkCount > 4) ||
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
