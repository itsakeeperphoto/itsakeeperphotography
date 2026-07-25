async (page) => {
  const baseUrl = "http://127.0.0.1:4321/";
  const artifactDir = ".artifacts/home-feedback/final";
  const viewports = [
    { id: "1728x963", width: 1728, height: 963 },
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

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });

    for (const selector of ["#main-content > .photo-banner", "#meet-lisa", "#faq"]) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(180);
      await section.locator("img").evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
      });
    }

    const bannerCta = page.locator(".photo-banner__copy .outline-button");
    await bannerCta.focus();
    const bannerFocusVisible = await bannerCta.evaluate((element) => {
      const style = getComputedStyle(element);
      return (
        element.matches(":focus-visible") &&
        style.outlineStyle !== "none" &&
        parseFloat(style.outlineWidth) >= 2
      );
    });

    const biographyCta = page.locator(".biography__action");
    await biographyCta.focus();
    const biographyFocusVisible = await biographyCta.evaluate((element) => {
      const style = getComputedStyle(element);
      return (
        element.matches(":focus-visible") &&
        style.outlineStyle !== "none" &&
        parseFloat(style.outlineWidth) >= 2
      );
    });

    const faqSummary = page.locator(".home-faq__item summary").nth(1);
    await faqSummary.focus();
    const faqWasOpen = await faqSummary.evaluate(
      (element) => element.parentElement?.hasAttribute("open") || false,
    );
    await page.keyboard.press("Enter");
    const faqOpenedWithKeyboard = await faqSummary.evaluate(
      (element, wasOpen) =>
        (element.parentElement?.hasAttribute("open") || false) !== wasOpen,
      faqWasOpen,
    );
    const faqFocusVisible = await faqSummary.evaluate((element) => {
      const style = getComputedStyle(element);
      return (
        element.matches(":focus-visible") &&
        (style.outlineStyle !== "none" || style.boxShadow !== "none")
      );
    });
    await page.keyboard.press("Enter");
    await faqSummary.evaluate((element) => element.blur());
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(({ width }) => {
      const element = (selector) => document.querySelector(selector);
      const rect = (selector) => element(selector)?.getBoundingClientRect();
      const banner = rect("#main-content > .photo-banner");
      const bannerHeading = rect(".photo-banner__copy h2");
      const bannerParagraph = rect(".photo-banner__copy > p");
      const bannerCta = rect(".photo-banner__copy .outline-button");
      const bannerPhrase = rect(".photo-banner__phrase");
      const biography = rect("#meet-lisa");
      const biographyMedia = rect(".biography__media");
      const biographyArch = rect("[data-biography-arch]");
      const biographyPrint = rect("[data-biography-print]");
      const biographyHeading = rect("#biography-title");
      const biographyVertical = rect(".biography__line--vertical");
      const biographyHorizontal = rect(".biography__line--horizontal");
      const faq = rect("#faq");
      const faqShell = rect("#faq > .content-shell");
      const faqList = rect(".home-faq__list");
      const faqPseudo = getComputedStyle(element("#faq"), "::before");
      const faqLineX = faq.left + parseFloat(faqPseudo.left);
      const images = [
        ...document.querySelectorAll(
          "#main-content > .photo-banner img, #meet-lisa img",
        ),
      ];
      const intersects = (a, b) =>
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top;
      const activeAnimations = [
        element("#main-content > .photo-banner"),
        element("#meet-lisa"),
        element("#faq"),
      ].reduce(
        (total, section) =>
          total +
          (section
            ?.getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running").length || 0),
        0,
      );
      const bannerMinimum = width > 1200 ? 64 : width > 767 ? 48 : 32;
      const expectedBiographyArchOffset = width > 1050 ? 108 : null;

      return {
        statusGeometry: {
          overflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          activeAnimations,
        },
        banner: {
          height: banner.height,
          topBreathing: bannerHeading.top - banner.top,
          bottomBreathing: banner.bottom - bannerCta.bottom,
          headingParagraphGap: bannerParagraph.top - bannerHeading.bottom,
          paragraphCtaGap: bannerCta.top - bannerParagraph.bottom,
          minimumBreathing: bannerMinimum,
          phraseIntersectsHeading: intersects(bannerPhrase, bannerHeading),
          phraseIntersectsParagraph: intersects(bannerPhrase, bannerParagraph),
          phraseIntersectsCta: intersects(bannerPhrase, bannerCta),
          copyInside:
            bannerHeading.top >= banner.top &&
            bannerCta.bottom <= banner.bottom &&
            bannerHeading.left >= banner.left &&
            bannerHeading.right <= banner.right,
        },
        biography: {
          mediaOffset: biographyMedia.top - biography.top,
          archOffset: biographyArch.top - biography.top,
          headingArchDelta: Math.abs(biographyHeading.top - biographyArch.top),
          expectedArchOffset: expectedBiographyArchOffset,
          overlapX: Math.max(
            0,
            Math.min(biographyArch.right, biographyPrint.right) -
              Math.max(biographyArch.left, biographyPrint.left),
          ),
          overlapY: Math.max(
            0,
            Math.min(biographyArch.bottom, biographyPrint.bottom) -
              Math.max(biographyArch.top, biographyPrint.top),
          ),
          verticalAnchorDelta: Math.abs(
            biographyVertical.left - biographyArch.left,
          ),
          horizontalAnchorDelta: Math.abs(
            biographyHorizontal.top - biographyPrint.top,
          ),
        },
        faq: {
          lineX: faqLineX,
          shellX: faqShell.left,
          listX: faqList.left,
          shellAnchorDelta: Math.abs(faqLineX - faqShell.left),
          contentGap: faqList.left - faqLineX,
          lineWidth: parseFloat(faqPseudo.width),
          horizontalWidth: parseFloat(
            getComputedStyle(element(".home-faq__list")).borderTopWidth,
          ),
          itemWidth: parseFloat(
            getComputedStyle(element(".home-faq__item")).borderBottomWidth,
          ),
        },
        images: images.map((image) => ({
          src: image.currentSrc || image.src,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          objectFit: getComputedStyle(image).objectFit,
        })),
      };
    }, { width: viewport.width });

    const failures = [];
    if (response?.status() !== 200) failures.push(`status ${response?.status()}`);
    if (consoleErrors.length) failures.push("console errors");
    if (pageErrors.length) failures.push("page errors");
    if (failedRequests.length) failures.push("failed requests");
    if (metrics.statusGeometry.overflow > 1) failures.push("horizontal overflow");
    if (!metrics.statusGeometry.reducedMotion) failures.push("reduced motion off");
    if (metrics.statusGeometry.activeAnimations > 0) failures.push("active animation");
    if (
      metrics.banner.topBreathing < metrics.banner.minimumBreathing ||
      metrics.banner.bottomBreathing < metrics.banner.minimumBreathing
    ) {
      failures.push("banner breathing");
    }
    if (Math.abs(metrics.banner.headingParagraphGap - 20) > 1) {
      failures.push("heading/paragraph gap");
    }
    if (Math.abs(metrics.banner.paragraphCtaGap - 32) > 1) {
      failures.push("paragraph/CTA gap");
    }
    if (
      metrics.banner.phraseIntersectsHeading ||
      metrics.banner.phraseIntersectsParagraph ||
      metrics.banner.phraseIntersectsCta
    ) {
      failures.push("script collision");
    }
    if (!metrics.banner.copyInside) failures.push("banner copy clipped");
    if (
      metrics.biography.expectedArchOffset !== null &&
      Math.abs(
        metrics.biography.archOffset -
          metrics.biography.expectedArchOffset,
      ) > 1
    ) {
      failures.push("biography not raised");
    }
    if (
      metrics.biography.overlapX < 40 ||
      metrics.biography.overlapY < 70
    ) {
      failures.push("biography overlap");
    }
    if (
      metrics.biography.verticalAnchorDelta > 1 ||
      metrics.biography.horizontalAnchorDelta > 1
    ) {
      failures.push("biography line detached");
    }
    if (
      metrics.faq.shellAnchorDelta > 1 ||
      metrics.faq.contentGap < (viewport.width <= 767 ? 20 : viewport.width <= 1050 ? 30 : 40)
    ) {
      failures.push("FAQ line placement");
    }
    if (
      Math.abs(metrics.faq.lineWidth - 1) > 0.1 ||
      Math.abs(metrics.faq.horizontalWidth - 1) > 0.1 ||
      Math.abs(metrics.faq.itemWidth - 1) > 0.1
    ) {
      failures.push("FAQ hairline width");
    }
    if (
      metrics.images.some(
        (image) =>
          !image.complete ||
          image.naturalWidth === 0 ||
          image.naturalHeight === 0 ||
          image.objectFit !== "cover",
      )
    ) {
      failures.push("image load/crop");
    }
    if (!bannerFocusVisible) failures.push("banner focus");
    if (!biographyFocusVisible) failures.push("biography focus");
    if (!faqFocusVisible || !faqOpenedWithKeyboard) failures.push("FAQ keyboard");

    const screenshotChromeMask = await page.addStyleTag({
      content: ".site-header,.skip-link{visibility:hidden!important}",
    });
    await page.locator("#main-content > .photo-banner").screenshot({
      path: `${artifactDir}/banner-${viewport.id}.png`,
      animations: "disabled",
      scale: "css",
    });
    await page.locator("#meet-lisa").screenshot({
      path: `${artifactDir}/meet-lisa-${viewport.id}.png`,
      animations: "disabled",
      scale: "css",
    });
    await page.locator("#faq").screenshot({
      path: `${artifactDir}/faq-${viewport.id}.png`,
      animations: "disabled",
      scale: "css",
    });

    const transitionRegion = await page.evaluate(() => {
      const banner = document
        .querySelector("#main-content > .photo-banner")
        .getBoundingClientRect();
      const biography = document.querySelector("#meet-lisa").getBoundingClientRect();
      const scrollTop = window.scrollY;
      const top = banner.bottom + scrollTop - Math.min(220, banner.height / 3);
      const bottom =
        biography.top + scrollTop + Math.min(320, biography.height / 2);
      return { documentTop: Math.max(0, top), height: bottom - top };
    });
    await page.evaluate((top) => window.scrollTo(0, top), transitionRegion.documentTop);
    await page.waitForTimeout(80);
    await page.screenshot({
      path: `${artifactDir}/banner-to-lisa-${viewport.id}.png`,
      clip: {
        x: 0,
        y: 0,
        width: viewport.width,
        height: Math.min(transitionRegion.height, viewport.height),
      },
      animations: "disabled",
      scale: "css",
    });
    await screenshotChromeMask.evaluate((style) => style.remove());
    await page.screenshot({
      path: `${artifactDir}/home-${viewport.id}.png`,
      fullPage: true,
      animations: "disabled",
      scale: "css",
    });

    results.push({
      viewport: viewport.id,
      failures,
      consoleErrors,
      pageErrors,
      failedRequests,
      bannerFocusVisible,
      biographyFocusVisible,
      faqFocusVisible,
      faqOpenedWithKeyboard,
      ...metrics,
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onRequestFailed);
  }

  const failures = results.filter((result) => result.failures.length > 0);
  return {
    screenshotCount: viewports.length * 5,
    resultCount: results.length,
    failureCount: failures.length,
    failures: failures.map((result) => ({
      viewport: result.viewport,
      failures: result.failures,
    })),
    results,
  };
}
