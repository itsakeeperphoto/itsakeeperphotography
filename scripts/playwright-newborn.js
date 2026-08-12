async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/newborn-photographer-tri-cities-wa/";
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const expected = {
    h1: ["Newborn Photographer in the Tri-Cities, WA"],
    h2: [
      "The Short Answer: I Come to You",
      "These Days Go So Fast",
      "What Your Newborn Session Looks Like",
      "When to Book — and Why It's Probably Not Too Late",
      "Twenty Years of Watching Them Grow Up",
      "Newborn Session Questions",
      "Expecting? Let's Talk Early",
    ],
    links: [
      "/contact/",
      "/family-photographer-tri-cities-wa/",
      "/contact/",
    ],
    faq: [
      "Where do newborn sessions take place?",
      "When should newborn photos be taken?",
      "Do you use props or a studio setup?",
      "What if my baby cries the whole time?",
      "Is my house too small or too dark?",
      "Can we include siblings, grandparents or pets?",
      "What should we wear?",
      "How long until we see the photos?",
    ],
    protectedDom: {
      hero: "a7a2bc38e0b2a5ebc813e0d5c169b1e88d626ff110ed09b0c74e97a543429633",
      process: "93006399e193e1ca262da237d45e459b4a38e05c44a3550d0d996a1f414613f4",
    },
    geometry: {
      "1440": {
        hero: [1440, 882],
        heroCopy: [1120, 544.95],
        heroLeft: [292.09, 409.91],
        heroRight: [285.68, 405.93],
        process: [1440, 1262.81],
        processInner: [1180, 998.81],
        processTriptych: [1180, 647.08],
        processItems: [[377.33, 647.08], [377.33, 647.08], [377.34, 647.08]],
      },
      "1200": {
        hero: [1200, 782],
        heroCopy: [880, 612.31],
        heroLeft: [243.42, 341.59],
        heroRight: [238.07, 338.28],
        process: [1200, 1172.77],
        processInner: [1072, 908.77],
        processTriptych: [1072, 641.8],
        processItems: [[341.33, 641.8], [341.33, 641.8], [341.34, 641.8]],
      },
      "900": {
        hero: [900, 688],
        heroCopy: [688, 524.7],
        heroLeft: [183.1, 284.91],
        heroRight: [178.58, 282.5],
        process: [900, 1091.19],
        processInner: [828, 867.19],
        processTriptych: [828, 630.66],
        processItems: [[264, 630.66], [264, 630.66], [264, 630.66]],
      },
      "390": {
        hero: [390, 808.38],
        heroCopy: [390, 808.38],
        heroLeft: [132.29, 201.38],
        heroRight: [129.11, 199.62],
        process: [390, 2099.89],
        processInner: [350, 1899.89],
        processTriptych: [350, 1634.14],
        processItems: [[350, 462.7], [350, 589.38], [350, 438.06]],
      },
    },
  };

  const results = [];
  const failures = [];
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    const consoleErrors = [];
    const pageErrors = [];
    const failedSameOriginRequests = [];
    const failedSameOriginResponses = [];
    const onConsole = (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    const onPageError = (error) => pageErrors.push(error.message);
    const onRequestFailed = (request) => {
      if (request.url().startsWith(baseUrl)) {
        failedSameOriginRequests.push(
          `${request.method()} ${request.url()} — ${request.failure()?.errorText || "failed"}`,
        );
      }
    };
    const onResponse = (response) => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) {
        failedSameOriginResponses.push(`${response.status()} ${response.url()}`);
      }
    };
    page.on("console", onConsole);
    page.on("pageerror", onPageError);
    page.on("requestfailed", onRequestFailed);
    page.on("response", onResponse);

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.locator(".newborn-page").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    const pageImages = page.locator(".newborn-page img");
    for (let index = 0; index < await pageImages.count(); index += 1) {
      const image = pageImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode().catch(() => undefined));
    }
    await page.evaluate(() => window.scrollTo(0, 0));

    const faq = page.locator(
      'section[aria-labelledby="newborn-session-questions-title"] details',
    );
    const secondSummary = faq.nth(1).locator("summary");
    const thirdSummary = faq.nth(2).locator("summary");
    const keyboardResults = [];
    for (const [summary, key] of [[secondSummary, "Enter"], [thirdSummary, "Space"]]) {
      await summary.focus();
      const before = await summary.evaluate((element) =>
        element.parentElement?.hasAttribute("open") || false,
      );
      await page.keyboard.press(key);
      const after = await summary.evaluate((element) =>
        element.parentElement?.hasAttribute("open") || false,
      );
      keyboardResults.push({ key, toggled: before !== after });
      await page.keyboard.press(key);
    }

    const audit = await page.evaluate(async ({ expectedFaq }) => {
      const root = document.querySelector(".newborn-page");
      const hero = root?.querySelector('[data-editorial-hero-page="newborn"]');
      const process = root?.querySelector(".newborn-process");
      const faqSection = root?.querySelector(
        'section[aria-labelledby="newborn-session-questions-title"]',
      );
      const normalize = (value = "") => value
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const cleanHtml = (node) => (node?.outerHTML || "")
        .replace(/\s+/g, " ")
        .trim();
      const hash = async (value) => {
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(value),
        );
        return [...new Uint8Array(digest)]
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
      };
      const rect = (element) => {
        const box = element?.getBoundingClientRect();
        return box
          ? {
              x: +box.x.toFixed(2),
              y: +box.y.toFixed(2),
              width: +box.width.toFixed(2),
              height: +box.height.toFixed(2),
              right: +box.right.toFixed(2),
              bottom: +box.bottom.toFixed(2),
            }
          : null;
      };
      const details = [...(faqSection?.querySelectorAll("details") || [])];
      const images = [...(root?.querySelectorAll("img") || [])].map((image) => {
        const width = Number(image.getAttribute("width"));
        const height = Number(image.getAttribute("height"));
        return {
          src: image.getAttribute("src"),
          alt: image.getAttribute("alt"),
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          hasDimensions: width > 0 && height > 0,
          ratioDelta:
            image.naturalWidth && image.naturalHeight && width && height
              ? Math.abs(image.naturalWidth / image.naturalHeight - width / height)
              : Infinity,
        };
      });
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((script) => {
          try {
            return JSON.parse(script.textContent || "");
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      const faqSchemas = schemas.filter((schema) => schema["@type"] === "FAQPage");
      const faqEntities = faqSchemas[0]?.mainEntity || [];
      const serviceSchemas = schemas.filter((schema) => schema["@type"] === "Service");
      const breadcrumbSchemas = schemas.filter(
        (schema) => schema["@type"] === "BreadcrumbList",
      );
      const webPageSchemas = schemas.filter((schema) => schema["@type"] === "WebPage");
      const faqQuestions = details.map((detail) =>
        normalize(
          detail.querySelector('summary [role="heading"]')?.textContent || "",
        ),
      );
      const faqAnswers = details.map((detail) =>
        normalize(detail.querySelector(":scope > div")?.textContent || ""),
      );
      const internalLinks = [...(root?.querySelectorAll("a[href]") || [])]
        .map((anchor) => new URL(anchor.href, location.href))
        .filter((url) => url.origin === location.origin)
        .map((url) => url.pathname);
      const h2s = [...(root?.querySelectorAll("h2") || [])];
      const headingsFit = h2s.every((node) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        const ink = range.getBoundingClientRect();
        const container = (node.closest("section") || root).getBoundingClientRect();
        return ink.left >= container.left - 1 && ink.right <= container.right + 1;
      });
      const processItems = [...(process?.querySelectorAll(".newborn-process__item") || [])];
      const processItemRects = processItems.map(rect);
      const summaries = details.map((detail) => detail.querySelector("summary"));

      return {
        contentStatus: root?.getAttribute("data-content-status"),
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        robots: document.querySelector('meta[name="robots"]')?.content || "",
        h1: [...(root?.querySelectorAll("h1") || [])].map((node) =>
          normalize(node.textContent || ""),
        ),
        h2: h2s.map((node) => normalize(node.textContent || "")),
        headingsFit,
        internalLinks,
        faqQuestions,
        faqCount: details.length,
        faqVisible: details.every((detail) => {
          const box = detail.getBoundingClientRect();
          const style = getComputedStyle(detail);
          return box.width > 0 && box.height > 0 && style.display !== "none" &&
            style.visibility !== "hidden";
        }),
        faqSchemaCount: faqSchemas.length,
        faqSchemaCountQuestions: faqEntities.length,
        faqSchemaMatches:
          JSON.stringify(faqQuestions) === JSON.stringify(expectedFaq) &&
          details.every((detail, index) =>
            faqEntities[index]?.["@type"] === "Question" &&
            faqEntities[index]?.acceptedAnswer?.["@type"] === "Answer" &&
            faqQuestions[index] === faqEntities[index]?.name &&
            faqAnswers[index] === faqEntities[index]?.acceptedAnswer?.text,
          ),
        schemaCounts: {
          service: serviceSchemas.length,
          breadcrumb: breadcrumbSchemas.length,
          webPage: webPageSchemas.length,
        },
        serviceSchema: serviceSchemas[0] || null,
        summaryTargetsPass: summaries.every((summary) => {
          const box = summary?.getBoundingClientRect();
          return box && box.height >= 44 && box.width >= 44;
        }),
        focusIndicatorPass: summaries.every((summary) => {
          if (!summary) return false;
          summary.focus();
          const style = getComputedStyle(summary);
          const pass = summary.matches(":focus-visible") &&
            ((style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2) ||
              style.boxShadow !== "none");
          summary.blur();
          return pass;
        }),
        images,
        horizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        rootBounds: rect(root),
        sectionBounds: [...(root?.querySelectorAll(":scope > section, :scope > header") || [])]
          .map(rect),
        protectedDom: {
          hero: await hash(cleanHtml(hero)),
          process: await hash(cleanHtml(process)),
        },
        geometry: {
          hero: rect(hero),
          heroCopy: rect(hero?.querySelector("[data-hero-copy]")),
          heroLeft: rect(hero?.querySelector('[data-hero-print="left"]')),
          heroRight: rect(hero?.querySelector('[data-hero-print="right"]')),
          process: rect(process),
          processInner: rect(process?.querySelector(".newborn-process__inner")),
          processTriptych: rect(process?.querySelector(".newborn-process__triptych")),
          processItems: processItemRects,
        },
        processResponsivePass:
          innerWidth <= 767
            ? processItemRects.length === 3 &&
              processItemRects.every((box, index) =>
                box.width >= innerWidth - 42 &&
                (index === 0 || box.y > processItemRects[index - 1].bottom),
              )
            : processItemRects.length === 3 &&
              Math.max(...processItemRects.map((box) => box.y)) -
                Math.min(...processItemRects.map((box) => box.y)) <= 1,
      };
    }, { expectedFaq: expected.faq });

    const tolerance = 3;
    const close = (actual, baseline) =>
      actual && Math.abs(actual.width - baseline[0]) <= tolerance &&
      Math.abs(actual.height - baseline[1]) <= tolerance;
    const geometry = expected.geometry[viewport.id];
    const geometryPass =
      close(audit.geometry.hero, geometry.hero) &&
      close(audit.geometry.heroCopy, geometry.heroCopy) &&
      close(audit.geometry.heroLeft, geometry.heroLeft) &&
      close(audit.geometry.heroRight, geometry.heroRight) &&
      close(audit.geometry.process, geometry.process) &&
      close(audit.geometry.processInner, geometry.processInner) &&
      close(audit.geometry.processTriptych, geometry.processTriptych) &&
      audit.geometry.processItems.length === geometry.processItems.length &&
      audit.geometry.processItems.every((item, index) =>
        close(item, geometry.processItems[index]),
      );
    const sectionsWithinViewport = audit.sectionBounds.every((box) =>
      box && box.x >= -1 && box.right <= viewport.width + 1,
    );
    const checks = {
      response: Boolean(response?.ok()),
      contentStatus: audit.contentStatus === "ready",
      seo:
        audit.canonical ===
          "https://www.itsakeeperphotography.com/newborn-photographer-tri-cities-wa/" &&
        audit.robots.startsWith("index, follow") &&
        audit.schemaCounts.service === 1 &&
        audit.schemaCounts.breadcrumb === 1 &&
        audit.schemaCounts.webPage === 1 &&
        audit.serviceSchema?.name === "Newborn Photography" &&
        audit.serviceSchema?.serviceType === "In-home newborn and baby photography",
      h1: JSON.stringify(audit.h1) === JSON.stringify(expected.h1),
      h2: JSON.stringify(audit.h2) === JSON.stringify(expected.h2),
      headingsFit: audit.headingsFit,
      links: JSON.stringify(audit.internalLinks) === JSON.stringify(expected.links),
      faq:
        audit.faqCount === 8 && audit.faqVisible &&
        JSON.stringify(audit.faqQuestions) === JSON.stringify(expected.faq) &&
        audit.faqSchemaCount === 1 && audit.faqSchemaCountQuestions === 8 &&
        audit.faqSchemaMatches,
      faqKeyboard: keyboardResults.every((result) => result.toggled),
      faqTargets: audit.summaryTargetsPass,
      focus: audit.focusIndicatorPass,
      images:
        audit.images.length > 0 &&
        audit.images.every((image) =>
          image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 &&
          image.hasDimensions && image.ratioDelta < 0.005 && image.alt !== null,
        ),
      noOverflow: !audit.horizontalOverflow && sectionsWithinViewport,
      protectedDom:
        audit.protectedDom.hero === expected.protectedDom.hero &&
        audit.protectedDom.process === expected.protectedDom.process,
      protectedGeometry: geometryPass,
      processResponsive: audit.processResponsivePass,
      runtime:
        pageErrors.length === 0 && failedSameOriginRequests.length === 0 &&
        failedSameOriginResponses.length === 0,
    };
    const viewportFailures = Object.entries(checks)
      .filter(([, pass]) => !pass)
      .map(([name]) => name);
    if (viewportFailures.length) {
      failures.push(`${viewport.id}px: ${viewportFailures.join(", ")}`);
    }
    results.push({
      viewport: viewport.id,
      checks,
      audit,
      keyboardResults,
      consoleErrors,
      pageErrors,
      failedSameOriginRequests,
      failedSameOriginResponses,
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onRequestFailed);
    page.off("response", onResponse);
  }

  if (failures.length) {
    throw new Error(`Newborn responsive QA failed:\n${failures.join("\n")}`);
  }
  return results;
}
