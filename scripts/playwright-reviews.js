async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/reviews/";
  const releaseOrigin = "https://www.itsakeeperphotography.com";
  const reviewUrl = "https://g.page/r/CZnCWAWyBWnQEBM/review";
  const viewports = [
    { id: "1920", width: 1920, height: 963, heroHeight: 845 },
    { id: "1440", width: 1440, height: 1000, heroHeight: 882 },
    { id: "1200", width: 1200, height: 900, heroHeight: 782 },
    { id: "900", width: 900, height: 900, heroHeight: 688 },
    { id: "390", width: 390, height: 844, heroHeight: 656 },
  ];
  const expected = {
    title: "Client Reviews | It's A Keeper Photography",
    description:
      "Read verified client stories from Tri-Cities families, seniors, couples and business clients photographed by Lisa Weiss.",
    h1: ["Client Reviews in the Tri-Cities"],
    h2: [
      "At Ease, on Purpose",
      "What Tri-Cities Clients Remember",
      "The Photographs Behind the Words",
      "Leave the Nerves at Home",
    ],
    reviewLabel: "Leave us a review",
    contactLabel: "Start planning your session",
  };

  const failures = [];
  const results = [];
  const ignoredRequest = /(?:clarity\.ms|googletagmanager\.com|google-analytics\.com|\/api\/google-review-summary)/i;
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const viewport of viewports) {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const failedResponses = [];
    const onConsole = (message) => {
      const source = `${message.text()} ${message.location().url || ""}`;
      if (message.type() === "error" && !ignoredRequest.test(source)) {
        consoleErrors.push(message.text());
      }
    };
    const onPageError = (error) => pageErrors.push(error.message);
    const onRequestFailed = (request) => {
      if (request.url().startsWith(baseUrl) && !ignoredRequest.test(request.url())) {
        failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText || "failed"}`);
      }
    };
    const onResponse = (response) => {
      if (
        response.url().startsWith(baseUrl) &&
        response.status() >= 400 &&
        !ignoredRequest.test(response.url())
      ) {
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
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      if (!response?.ok()) failures.push(`${viewport.id}: route returned ${response?.status()}`);
      await page.locator(".reviews-page").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => Boolean(customElements.get("review-polaroids")));
      await page.locator("review-polaroids.is-enhanced").waitFor({ state: "attached" });

      const initial = await page.evaluate(({ expected, heroHeight }) => {
        const normalize = (value) => value?.replace(/\s+/g, " ").trim() || "";
        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            x: Number(box.x.toFixed(2)),
            y: Number(box.y.toFixed(2)),
            width: Number(box.width.toFixed(2)),
            height: Number(box.height.toFixed(2)),
          };
        };
        const horizontallyFits = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return false;
          const box = element.getBoundingClientRect();
          return (
            box.left >= -1 &&
            box.right <= window.innerWidth + 1 &&
            element.scrollWidth <= Math.ceil(element.clientWidth) + 1
          );
        };
        const horizontalMetrics = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            left: Number(box.left.toFixed(2)),
            right: Number(box.right.toFixed(2)),
            width: Number(box.width.toFixed(2)),
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
            fontSize: getComputedStyle(element).fontSize,
          };
        };
        const contrastRatio = (foreground, background) => {
          const luminance = (color) => {
            const channels = (color.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
            const linear = channels.map((channel) => {
              const value = channel / 255;
              return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
          };
          const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
          return Number(((values[0] + 0.05) / (values[1] + 0.05)).toFixed(2));
        };
        const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((node) => {
            try { return JSON.parse(node.textContent || "{}"); } catch { return null; }
          })
          .filter(Boolean);
        const schemaTypes = schemas.flatMap((schema) =>
          Array.isArray(schema?.["@graph"])
            ? schema["@graph"].map((item) => item?.["@type"])
            : [schema?.["@type"]]
        ).flat().filter(Boolean);
        const mainAnchors = [...document.querySelectorAll("main a")].map((anchor) => ({
          href: anchor.getAttribute("href"),
          label: normalize(anchor.textContent),
          target: anchor.getAttribute("target"),
          rel: anchor.getAttribute("rel"),
        }));
        const hero = rect(".editorial-hero");
        const heroTitle = document.querySelector(".editorial-hero__title");
        const heroTitleRect = heroTitle?.getBoundingClientRect();
        const heroCopyRect = document.querySelector(".editorial-hero__copy")?.getBoundingClientRect();
        const summary = document.querySelector(".kind-words__google > span");
        const reviewButton = document.querySelector("[data-review-action]");
        const journalIntro = document.querySelector(".reviews-journal__intro");
        const summaryColor = summary ? getComputedStyle(summary).color : "";
        const summaryBackground = summary
          ? getComputedStyle(summary.closest(".kind-words")).backgroundColor
          : "";
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
          robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          h1: [...document.querySelectorAll("main h1")].map((node) => normalize(node.getAttribute("aria-label") || node.textContent)),
          h2: [...document.querySelectorAll("main h2")].map((node) => normalize(node.textContent)),
          h3: [...document.querySelectorAll("main h3")].map((node) => normalize(node.textContent)),
          schemaTypes,
          mainAnchors,
          hero,
          heroExpectedHeight: heroHeight,
          heroTitleInsideCopy: Boolean(
            heroTitleRect && heroCopyRect &&
            heroTitleRect.left >= heroCopyRect.left - 1 &&
            heroTitleRect.right <= heroCopyRect.right + 1
          ),
          journalTitleFits: horizontallyFits(".reviews-journal__intro h2"),
          finalTitleFits: horizontallyFits(".reviews-final h2"),
          journalTitleMetrics: horizontalMetrics(".reviews-journal__intro h2"),
          finalTitleMetrics: horizontalMetrics(".reviews-final h2"),
          heroPrints: document.querySelectorAll(".editorial-hero__print").length,
          reviewOriginals: document.querySelectorAll("[data-review-group] [data-review-card]").length,
          journalPages: document.querySelectorAll('[data-journal-instance="reviews-journal"] .journal-sheet').length,
          bookLoading: [...document.querySelectorAll('[data-journal-instance="reviews-journal"] img')].map((image) => image.loading),
          journalDensity: [...document.querySelectorAll('[data-journal-instance="reviews-journal"] .journal-sheet')]
            .map((sheet) => sheet.getAttribute("data-density")),
          easeRules: document.querySelectorAll(".reviews-ease__rule").length,
          signature: document.querySelector(".reviews-page")?.getAttribute("data-signature-device"),
          summaryColor,
          summaryContrast: summary ? contrastRatio(summaryColor, summaryBackground) : 0,
          reviewButtonHeight: reviewButton?.getBoundingClientRect().height || 0,
          proofToJournalGap: reviewButton && journalIntro
            ? Number((journalIntro.getBoundingClientRect().top - reviewButton.getBoundingClientRect().bottom).toFixed(2))
            : null,
          directionFirst: document.body.firstChild?.nodeType === Node.COMMENT_NODE &&
            (document.body.firstChild.textContent || "").includes("seed c2ad8044"),
          titleMatches: document.title === expected.title,
        };
      }, { expected, heroHeight: viewport.heroHeight });

      if (!initial.titleMatches || initial.description !== expected.description) {
        failures.push(`${viewport.id}: title or description differs from the Reviews contract`);
      }
      if (JSON.stringify(initial.h1) !== JSON.stringify(expected.h1)) {
        failures.push(`${viewport.id}: H1 contract differs (${JSON.stringify(initial.h1)})`);
      }
      if (JSON.stringify(initial.h2) !== JSON.stringify(expected.h2)) {
        failures.push(`${viewport.id}: H2 contract differs (${JSON.stringify(initial.h2)})`);
      }
      if (initial.h3.length !== 6) failures.push(`${viewport.id}: journal must expose six H3 page titles`);
      if (!initial.directionFirst) failures.push(`${viewport.id}: direction contract is not the first body child`);
      if (!initial.hero || Math.abs(initial.hero.height - viewport.heroHeight) > 1) {
        failures.push(`${viewport.id}: shared hero height differs (${initial.hero?.height} vs ${viewport.heroHeight})`);
      }
      if (!initial.heroTitleInsideCopy || initial.heroPrints !== 2) {
        failures.push(`${viewport.id}: hero title or two-print geometry is broken`);
      }
      if (!initial.journalTitleFits || !initial.finalTitleFits) {
        failures.push(
          `${viewport.id}: journal or closing title is clipped ${JSON.stringify({ journal: initial.journalTitleMetrics, final: initial.finalTitleMetrics })}`
        );
      }
      if (initial.reviewOriginals !== 10) failures.push(`${viewport.id}: expected 10 source testimonials`);
      if (
        initial.journalPages !== 6 ||
        initial.bookLoading.some((value) => value !== "lazy") ||
        initial.journalDensity.some((value) => value !== "hard")
      ) {
        failures.push(`${viewport.id}: Reviews journal must have six lazy hard-cover pages`);
      }
      if (
        initial.mainAnchors.length !== 2 ||
        initial.mainAnchors[0]?.href !== reviewUrl ||
        initial.mainAnchors[0]?.label !== expected.reviewLabel ||
        initial.mainAnchors[0]?.target !== "_blank" ||
        initial.mainAnchors[0]?.rel !== "noopener noreferrer" ||
        initial.mainAnchors[1]?.href !== "/contact/" ||
        initial.mainAnchors[1]?.label !== expected.contactLabel
      ) {
        failures.push(`${viewport.id}: main must contain the safe Google review anchor followed by Contact`);
      }
      if (
        initial.easeRules !== 0 ||
        initial.signature !== "arch" ||
        initial.summaryContrast < 4.5 ||
        initial.reviewButtonHeight < 44 ||
        initial.proofToJournalGap === null ||
        initial.proofToJournalGap > 210
      ) {
        failures.push(
          `${viewport.id}: feedback geometry or contrast failed ${JSON.stringify({
            easeRules: initial.easeRules,
            signature: initial.signature,
            summaryColor: initial.summaryColor,
            summaryContrast: initial.summaryContrast,
            reviewButtonHeight: initial.reviewButtonHeight,
            proofToJournalGap: initial.proofToJournalGap,
          })}`
        );
      }
      if (
        !initial.schemaTypes.includes("WebPage") ||
        !initial.schemaTypes.includes("BreadcrumbList") ||
        initial.schemaTypes.includes("Review") ||
        initial.schemaTypes.includes("AggregateRating")
      ) {
        failures.push(`${viewport.id}: Reviews schema contract is invalid`);
      }
      if (initial.robots !== "index, follow, max-image-preview:large" || initial.canonical !== `${releaseOrigin}${route}`) {
        failures.push(`${viewport.id}: release robots or canonical is invalid`);
      }

      const heroButton = page.getByRole("button", { name: "Read their stories" });
      await heroButton.click();
      await page.waitForTimeout(250);
      const focusedId = await page.evaluate(() => document.activeElement?.id || "");
      if (focusedId !== "at-ease") failures.push(`${viewport.id}: hero control did not focus #at-ease`);

      const firstReview = page.locator("[data-review-group] [data-review-card]").first();
      await firstReview.scrollIntoViewIfNeeded();
      await page.mouse.move(viewport.width - 2, viewport.height - 2);
      await firstReview.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      if (!(await firstReview.evaluate((element) => element === document.activeElement))) {
        failures.push(`${viewport.id}: keyboard navigation did not reach the first testimonial`);
      }
      await page.waitForFunction(() =>
        document.querySelector("[data-review-group] [data-review-card]")?.getAttribute("data-review-state") === "back"
      );
      await firstReview.press("Escape");
      await page.waitForFunction(() =>
        document.querySelector("[data-review-group] [data-review-card]")?.getAttribute("data-review-state") === "front"
      );
      await page.waitForFunction(
        () => [...document.querySelectorAll(".review-polaroid__image")]
          .every((image) => Boolean(image.currentSrc) && image.complete && image.naturalWidth > 0),
        null,
        { timeout: 10_000 }
      );

      if (viewport.id === "1920") {
        const reviewButton = page.locator("[data-review-action]");
        await reviewButton.scrollIntoViewIfNeeded();
        const buttonBefore = await reviewButton.evaluate((element) => ({
          fillTransform: getComputedStyle(element, "::before").transform,
          arrowTransform: getComputedStyle(element.querySelector("svg")).transform,
          color: getComputedStyle(element).color,
        }));
        await reviewButton.hover();
        await page.waitForTimeout(380);
        const buttonAfter = await reviewButton.evaluate((element) => ({
          fillTransform: getComputedStyle(element, "::before").transform,
          arrowTransform: getComputedStyle(element.querySelector("svg")).transform,
          color: getComputedStyle(element).color,
        }));
        if (
          buttonBefore.fillTransform === buttonAfter.fillTransform ||
          buttonBefore.arrowTransform === buttonAfter.arrowTransform ||
          buttonBefore.color === buttonAfter.color
        ) {
          failures.push(`1920: Google review CTA hover animation did not produce fill, arrow and color feedback`);
        }
        await page.mouse.move(viewport.width - 2, 2);
      }

      const book = page.locator('[data-journal-instance="reviews-journal"]');
      await book.scrollIntoViewIfNeeded();
      await page.waitForFunction(() =>
        document.querySelector('[data-journal-instance="reviews-journal"]')?.getAttribute("data-hydration") === "ready",
        null,
        { timeout: 10_000 }
      );
      const beforePage = await book.locator("[data-journal-current]").textContent();
      const nextButton = book.getByRole("button", { name: "Next" });
      if (!(await nextButton.isEnabled())) failures.push(`${viewport.id}: journal Next control did not enable`);
      else {
        await nextButton.click();
        await page.waitForTimeout(420);
        const midTurn = await book.evaluate((element) => {
          const transforms = [...element.querySelectorAll(".stf__item")]
            .map((item) => getComputedStyle(item).transform)
            .filter((transform) => transform && transform !== "none");
          return {
            state: element.getAttribute("data-flip-state"),
            transforms,
            hasThreeDimensionalPage: transforms.some((transform) => transform.startsWith("matrix3d(")),
            hardShadowsVisible: [...element.querySelectorAll(".stf__hardShadow")]
              .some((shadow) => getComputedStyle(shadow).display !== "none"),
          };
        });
        if (
          midTurn.state !== "flipping" ||
          !midTurn.hasThreeDimensionalPage ||
          !midTurn.hardShadowsVisible
        ) {
          failures.push(`${viewport.id}: physical 3D page turn is not visible (${JSON.stringify(midTurn)})`);
        }
        if (viewport.id === "1920") {
          await book.screenshot({
            path: ".artifacts/reviews-2026-08-12/feedback/book-midturn-hard.png",
            animations: "allow",
          });
        }
        await page.waitForFunction(
          () => document.querySelector('[data-journal-instance="reviews-journal"]')?.getAttribute("data-flip-state") === "read",
          null,
          { timeout: 3_000 }
        );
        const afterPage = await book.locator("[data-journal-current]").textContent();
        if (beforePage === afterPage) failures.push(`${viewport.id}: journal Next did not advance`);
      }

      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 720) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 75));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);
      const final = await page.evaluate(() => {
        const bodyCopies = [...document.querySelectorAll(
          ".reviews-ease__copy > p:last-child, .reviews-journal__lede, .reviews-final__inner > p:not(.reviews-final__script)"
        )];
        const controls = [...document.querySelectorAll(
          ".editorial-hero__actions button, .journal-book__button, .kind-words__review-button, .reviews-final .outline-button"
        )];
        return {
          overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth,
          brokenImages: [...document.images]
            .filter((image) => image.currentSrc && image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc),
          minimumBodySize: Math.min(...bodyCopies.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))),
          minimumControlHeight: Math.min(...controls.map((node) => node.getBoundingClientRect().height)),
          reviewEnhanced: document.querySelector("review-polaroids")?.classList.contains("is-enhanced") || false,
          journalMode: document.querySelector('[data-journal-instance="reviews-journal"]')?.getAttribute("data-mode"),
          summaryIsSpan: document.querySelector(".kind-words__google > span") !== null,
          summarySelfLink: document.querySelector('.kind-words__google a[href="/reviews/"]') !== null,
          reviewActionCount: document.querySelectorAll('[data-review-action]').length,
          reviewImagesReady: [...document.querySelectorAll(".review-polaroid__image")]
            .every((image) => Boolean(image.currentSrc) && image.complete && image.naturalWidth > 0),
        };
      });
      if (final.overflow > 1) failures.push(`${viewport.id}: horizontal overflow is ${final.overflow}px`);
      if (final.brokenImages.length) failures.push(`${viewport.id}: broken images ${final.brokenImages.join(", ")}`);
      if (final.minimumBodySize < 16) failures.push(`${viewport.id}: body copy falls below 16px`);
      if (final.minimumControlHeight < 44) failures.push(`${viewport.id}: a control falls below 44px`);
      if (!final.reviewEnhanced || final.journalMode !== "page-flip" || !final.reviewImagesReady) {
        failures.push(`${viewport.id}: testimonial or journal enhancement did not initialize`);
      }
      if (!final.summaryIsSpan || final.summarySelfLink || final.reviewActionCount !== 1) {
        failures.push(`${viewport.id}: Reviews summary must remain static text without self-link`);
      }
      if (consoleErrors.length || pageErrors.length || failedRequests.length || failedResponses.length) {
        failures.push(
          `${viewport.id}: runtime failures ${JSON.stringify({ consoleErrors, pageErrors, failedRequests, failedResponses })}`
        );
      }

      await page.screenshot({
        path: `.artifacts/reviews-2026-08-12/final/reviews-${viewport.id}.png`,
        fullPage: true,
        animations: "disabled",
      });
      results.push({ viewport: viewport.id, initial, final });
    } catch (error) {
      failures.push(`${viewport.id}: ${error.message}`);
    } finally {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
    }
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  const reducedBook = page.locator('[data-journal-instance="reviews-journal"]');
  await reducedBook.scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    document.querySelector('[data-journal-instance="reviews-journal"]')?.getAttribute("data-hydration") === "ready",
    null,
    { timeout: 10_000 }
  );
  const reduced = await page.evaluate(() => {
    const book = document.querySelector('[data-journal-instance="reviews-journal"]');
    const motionHint = book?.querySelector(".journal-book__hint-motion");
    const reducedHint = book?.querySelector(".journal-book__hint-reduced");
    const reviewButton = document.querySelector("[data-review-action]");
    return {
      mode: book?.getAttribute("data-mode"),
      motionHintDisplay: motionHint ? getComputedStyle(motionHint).display : "missing",
      reducedHintDisplay: reducedHint ? getComputedStyle(reducedHint).display : "missing",
      easePrintTransform: getComputedStyle(document.querySelector(".reviews-ease__print")).transform,
      reviewFillTransition: reviewButton ? getComputedStyle(reviewButton, "::before").transitionDuration : "missing",
      reviewArrowTransition: reviewButton ? getComputedStyle(reviewButton.querySelector("svg")).transitionDuration : "missing",
    };
  });
  if (
    reduced.mode !== "crossfade" ||
    reduced.motionHintDisplay !== "none" ||
    reduced.reducedHintDisplay === "none" ||
    reduced.easePrintTransform !== "none" ||
    reduced.reviewFillTransition !== "0s" ||
    reduced.reviewArrowTransition !== "0s"
  ) {
    failures.push(`reduced motion: fallback contract failed (${JSON.stringify(reduced)})`);
  }

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/portfolio/`, { waitUntil: "domcontentloaded" });
  const portfolio = await page.evaluate(() => ({
    h1: document.querySelector("main h1")?.textContent?.replace(/\s+/g, " ").trim(),
    bookCount: document.querySelectorAll('[data-journal-instance="portfolio-journal"]').length,
    pageCount: document.querySelectorAll('[data-journal-instance="portfolio-journal"] .journal-sheet').length,
    density: [...document.querySelectorAll('[data-journal-instance="portfolio-journal"] .journal-sheet')]
      .map((sheet) => sheet.getAttribute("data-density")),
    firstPageLoading: [...document.querySelectorAll('[data-journal-instance="portfolio-journal"] .journal-sheet:first-child img')]
      .map((image) => ({ loading: image.loading, fetchpriority: image.getAttribute("fetchpriority") })),
  }));
  if (
    portfolio.h1 !== "The Journal" ||
    portfolio.bookCount !== 1 ||
    portfolio.pageCount !== 6 ||
    portfolio.density.some((value) => value !== "hard") ||
    portfolio.firstPageLoading.some((image) => image.loading !== "eager") ||
    portfolio.firstPageLoading[0]?.fetchpriority !== "high"
  ) {
    failures.push(`portfolio regression: ${JSON.stringify(portfolio)}`);
  }

  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.locator("review-polaroids").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("review-polaroids")?.classList.contains("is-enhanced"));
  await page.waitForFunction(
    () => [...document.querySelectorAll(".review-polaroid__image")]
      .every((image) => Boolean(image.currentSrc) && image.complete && image.naturalWidth > 0),
    null,
    { timeout: 10_000 }
  );
  const homepage = await page.evaluate(() => ({
    reviewActionCount: document.querySelectorAll("[data-review-action]").length,
    summaryHref: document.querySelector(".kind-words__google > a")?.getAttribute("href"),
    reviewImagesReady: [...document.querySelectorAll(".review-polaroid__image")]
      .every((image) => Boolean(image.currentSrc) && image.complete && image.naturalWidth > 0),
  }));
  if (
    homepage.reviewActionCount !== 0 ||
    homepage.summaryHref !== "/reviews/" ||
    !homepage.reviewImagesReady
  ) {
    failures.push(`homepage KindWords regression: ${JSON.stringify(homepage)}`);
  }

  const crawler = await page.evaluate(async ({ baseUrl }) => {
    const [sitemap, llms] = await Promise.all([
      fetch(`${baseUrl}/sitemap.xml`).then((response) => response.text()),
      fetch(`${baseUrl}/llms.txt`).then((response) => response.text()),
    ]);
    return {
      sitemapCount: (sitemap.match(/<url>/g) || []).length,
      llmsCount: (llms.match(/^- \[/gm) || []).length,
      sitemapHasReviews: sitemap.includes("https://www.itsakeeperphotography.com/reviews/"),
      llmsHasReviews: llms.includes("https://www.itsakeeperphotography.com/reviews/"),
    };
  }, { baseUrl });
  if (
    crawler.sitemapCount !== 13 ||
    crawler.llmsCount !== 12 ||
    !crawler.sitemapHasReviews ||
    !crawler.llmsHasReviews
  ) {
    failures.push(`crawler outputs: ${JSON.stringify(crawler)}`);
  }

  if (failures.length) throw new Error(`Reviews QA failed:\n- ${failures.join("\n- ")}`);
  return { status: "PASS", viewports: results, reducedMotion: reduced, portfolio, homepage, crawler };
}
