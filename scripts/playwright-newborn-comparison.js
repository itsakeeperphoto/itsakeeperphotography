async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/journal/in-home-vs-studio-newborn-photography/";
  const origins = {
    release: "https://www.itsakeeperphotography.com",
    staging: "https://itsakeeperphotography.netlify.app",
  };
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const expected = {
    title: "In-Home vs. Studio Newborn Photography: How to Choose",
    description:
      "In-home or studio newborn photos? An honest comparison from a Tri-Cities newborn photographer — comfort, style, timing and what each session really feels like.",
    h1: ["In-Home vs. Studio Newborn Photography"],
    h2: [
      "The Short Answer",
      "What Is In-Home Newborn Photography?",
      "What Is Studio Newborn Photography?",
      "The Honest Comparison",
      "What About Outdoor Newborn Sessions?",
      "Which One Will You Treasure More?",
      "Common Questions",
      "Planning Your Baby's First Photos in the Tri-Cities",
    ],
    h3: [
      "Comfort (yours and baby's)",
      "Style of the photographs",
      "Timing and flexibility",
      "Preparation and effort",
      "When should I book newborn photos?",
      "Is my house too small or too dark for in-home photos?",
      "What if we missed the two-week window?",
    ],
    anchors: [
      {
        href: "/family-photographer-tri-cities-wa/",
        label: "Family Photography",
      },
      {
        href: "/newborn-photographer-tri-cities-wa/",
        label: "See how my newborn sessions work",
      },
      { href: "/contact/", label: "Expecting? Let's talk early" },
    ],
    images: [
      {
        src: "/uploads/richland-mother-newborn-at-home.jpg",
        alt: "A mother holding her sleeping newborn beside a bed.",
      },
      { src: "/uploads/newborn-family-at-home-west-richland.jpg", alt: "" },
      { src: "/uploads/newborn-portrait-with-mother-richland.jpg", alt: "" },
      {
        src: "/uploads/family-newborn-at-home-tricities.jpg",
        alt: "Parents and an older sister holding a sleeping newborn together on a bed.",
      },
      {
        src: "/uploads/family-newborn-sunset-tricities.jpg",
        alt: "A family gathered around a baby outdoors in warm evening light.",
      },
      {
        src: "/uploads/family-with-baby-golden-hour-embrace-tricities.jpg",
        alt: "Parents holding their baby close outdoors in warm evening light.",
      },
      {
        src: "/uploads/family-newborn-connection-richland.jpg",
        alt: "Parents standing close with their baby in warm evening light.",
      },
      {
        src: "/uploads/family-with-baby-black-white-tricities.jpg",
        alt: "A family holding a baby together outdoors in a black-and-white portrait.",
      },
      {
        src: "/uploads/maternity-waiting-to-welcome-tricities.jpg",
        alt: "An expecting couple standing together in warm sunset light.",
      },
    ],
    faq: [
      {
        question: "When should I book newborn photos?",
        answer:
          "During your second or third trimester. Photographers hold flexible space around due dates — reaching out early means your spot is safe no matter when baby arrives.",
      },
      {
        question: "Is my house too small or too dark for in-home photos?",
        answer:
          "Almost never. One good window and a few honest square feet are enough — finding the light is the photographer's job, not yours.",
      },
      {
        question: "What if we missed the two-week window?",
        answer:
          "For in-home lifestyle photos, there's no missed window. Two months old is still brand new, still tiny, still worth documenting.",
      },
    ],
  };

  const results = [];
  const failures = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.unroute("**/*");
  for (const analyticsPattern of [
    "https://www.google-analytics.com/**",
    "https://www.googletagmanager.com/**",
    "https://www.clarity.ms/**",
  ]) {
    await page.route(analyticsPattern, (request) =>
      request.fulfill({ status: 204, body: "" }),
    );
  }

  for (const viewport of viewports) {
    const consoleErrors = [];
    const pageErrors = [];
    const failedSameOriginRequests = [];
    const failedSameOriginResponses = [];
    const onConsole = (message) => {
      if (
        message.type() === "error" &&
        !/(?:clarity\.ms|googletagmanager\.com|google-analytics\.com)/i.test(
          `${message.text()} ${message.location().url || ""}`,
        )
      ) {
        consoleErrors.push(message.text());
      }
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
    await page.locator(".newborn-comparison-page").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);

    const images = page.locator(".newborn-comparison-page img");
    for (let index = 0; index < await images.count(); index += 1) {
      const image = images.nth(index);
      if (index >= 3) await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode().catch(() => undefined));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const heroButton = page.locator(
      '.newborn-comparison-page [data-editorial-hero-page="journal"] button[data-hero-cta]',
    );
    await heroButton.focus();
    const heroButtonFocus = await heroButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        active: document.activeElement === element,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
        outlineOffset: Number.parseFloat(style.outlineOffset),
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      };
    });
    await page.keyboard.press("Enter");
    await page.waitForFunction(
      () => document.activeElement?.id === "the-short-answer" && window.scrollY > 0,
    );
    const heroScroll = await page.evaluate(() => {
      const target = document.getElementById("the-short-answer");
      return {
        targetFocused: document.activeElement === target,
        scrollY: window.scrollY,
        targetTop: target?.getBoundingClientRect().top ?? Infinity,
      };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const detailKeyboard = [];
    const details = page.locator(".newborn-comparison-faq__list details");
    for (const [index, key] of [[1, "Enter"], [2, "Space"]]) {
      const detail = details.nth(index);
      const summary = detail.locator("summary");
      await summary.focus();
      const focus = await summary.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          active: document.activeElement === element,
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          outlineOffset: Number.parseFloat(style.outlineOffset),
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        };
      });
      const before = await detail.evaluate((element) => element.open);
      await page.keyboard.press(key);
      const after = await detail.evaluate((element) => element.open);
      await page.keyboard.press(key);
      const restored = await detail.evaluate(
        (element, initialOpen) => element.open === initialOpen,
        before,
      );
      detailKeyboard.push({ index, key, toggled: before !== after, restored, focus });
    }

    const anchorFocus = [];
    const anchors = page.locator(".newborn-comparison-page a[href]");
    for (let index = 0; index < await anchors.count(); index += 1) {
      const anchor = anchors.nth(index);
      await anchor.scrollIntoViewIfNeeded();
      await anchor.focus();
      anchorFocus.push(await anchor.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          href: element.getAttribute("href"),
          active: document.activeElement === element,
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          outlineOffset: Number.parseFloat(style.outlineOffset),
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        };
      }));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const audit = await page.evaluate(
      ({ routePath, originCandidates, expectedImages }) => {
        const root = document.querySelector(".newborn-comparison-page");
        const normalize = (value = "") => value
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const flatten = (value) => {
          if (!value || typeof value !== "object") return [];
          if (Array.isArray(value)) return value.flatMap(flatten);
          return [value, ...Object.values(value).flatMap(flatten)];
        };
        const schemas = [...document.querySelectorAll(
          'script[type="application/ld+json"]',
        )].map((script) => {
          try {
            return JSON.parse(script.textContent || "");
          } catch {
            return null;
          }
        }).filter(Boolean);
        const schemaObjects = schemas.flatMap(flatten);
        const articles = schemas.filter((schema) => schema["@type"] === "Article");
        const faqSchemas = schemas.filter((schema) => schema["@type"] === "FAQPage");
        const breadcrumbs = schemas.filter(
          (schema) => schema["@type"] === "BreadcrumbList",
        );
        const topLevelServices = schemas.filter(
          (schema) => schema["@type"] === "Service",
        );
        const unsafeSchema = schemaObjects.some((schema) =>
          ["Review", "AggregateRating", "GeoCoordinates"].includes(
            schema["@type"],
          ) || Object.keys(schema).some((key) =>
            ["streetaddress", "latitude", "longitude"].includes(
              key.toLowerCase(),
            ) || key.toLowerCase().startsWith("gps"),
          ),
        );
        const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
        const publicationMode = canonical === `${originCandidates.release}${routePath}`
          ? "release"
          : canonical === `${originCandidates.staging}${routePath}`
            ? "staging"
            : "unknown";
        const expectedOrigin = publicationMode === "release"
          ? originCandidates.release
          : publicationMode === "staging"
            ? originCandidates.staging
            : "";
        const h1 = [...(root?.querySelectorAll("h1") || [])].map((item) =>
          normalize(item.textContent || ""));
        const h2 = [...(root?.querySelectorAll("h2") || [])].map((item) =>
          normalize(item.textContent || ""));
        const h3 = [...(root?.querySelectorAll("h3") || [])].map((item) =>
          normalize(item.textContent || ""));
        const headingElements = [...(root?.querySelectorAll("h1, h2, h3") || [])];
        const headingsFit = headingElements.every((element) => {
          const box = element.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(element);
          const ink = range.getBoundingClientRect();
          const style = getComputedStyle(element);
          return box.width > 0 && box.height > 0 && box.x >= -1 &&
            box.right <= document.documentElement.clientWidth + 1 &&
            ink.x >= -1 && ink.right <= document.documentElement.clientWidth + 1 &&
            style.textOverflow !== "ellipsis" &&
            ["", "none"].includes(style.webkitLineClamp);
        });
        const renderedImages = [...(root?.querySelectorAll("img") || [])].map(
          (image) => {
            const picture = image.closest("picture");
            const box = image.getBoundingClientRect();
            const currentPath = image.currentSrc
              ? new URL(image.currentSrc).pathname
              : "";
            const responsivePaths = [...(picture?.querySelectorAll(
              'source[type="image/webp"]',
            ) || [])].flatMap((source) =>
              (source.getAttribute("srcset") || "")
                .split(",")
                .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
                .filter(Boolean),
            );
            const naturalRatio = image.naturalHeight
              ? image.naturalWidth / image.naturalHeight
              : 0;
            const attributeRatio = Number(image.getAttribute("height"))
              ? Number(image.getAttribute("width")) /
                Number(image.getAttribute("height"))
              : 0;
            return {
              src: image.getAttribute("src") || "",
              alt: image.getAttribute("alt") || "",
              width: Number(image.getAttribute("width")),
              height: Number(image.getAttribute("height")),
              loading: image.getAttribute("loading"),
              decoding: image.getAttribute("decoding"),
              fetchpriority: image.getAttribute("fetchpriority"),
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
              renderedWidth: box.width,
              renderedHeight: box.height,
              decorative: image.alt === "" && image.closest("figure")?.getAttribute(
                "aria-hidden",
              ) === "true",
              currentPath,
              responsivePathCount: responsivePaths.length,
              allResponsiveWebp: responsivePaths.every((path) => /\.webp$/i.test(path)),
              ratioDelta: Math.abs(naturalRatio - attributeRatio),
            };
          },
        );
        const imageContractMatches = JSON.stringify(
          renderedImages.map(({ src, alt }) => ({ src, alt })),
        ) === JSON.stringify(expectedImages);
        const faqDetails = [...(root?.querySelectorAll(
          ".newborn-comparison-faq__list details",
        ) || [])].map((detail) => ({
          visible: !detail.hidden && detail.getAttribute("aria-hidden") !== "true",
          open: detail.open,
          question: normalize(detail.querySelector("summary")?.textContent || ""),
          answer: normalize(
            detail.querySelector(".newborn-comparison-faq__answer")?.textContent || "",
          ),
          summaryTarget: (() => {
            const summary = detail.querySelector("summary");
            const box = summary?.getBoundingClientRect();
            return Boolean(
              summary?.tabIndex === 0 && box && box.width >= 44 && box.height >= 44,
            );
          })(),
        }));
        const byline = root?.querySelector(".newborn-comparison-byline");
        const bylineValues = [...(byline?.querySelectorAll("span") || [])]
          .filter((item) => item.getAttribute("aria-hidden") !== "true")
          .map((item) => normalize(item.textContent || ""));
        const hero = root?.querySelector('[data-editorial-hero-page="journal"]');
        const heroButton = hero?.querySelector("button[data-hero-cta]");
        const anchors = [...(root?.querySelectorAll("a[href]") || [])].map(
          (anchor) => ({
            href: anchor.getAttribute("href") || "",
            label: normalize(anchor.textContent || ""),
          }),
        );
        const visibleText = [...(root?.querySelectorAll(
          "p, li",
        ) || [])].filter((element) => {
          const style = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" &&
            box.width > 0 && box.height > 0;
        });
        const minimumBodyFont = visibleText.length
          ? Math.min(...visibleText.map((element) =>
              Number.parseFloat(getComputedStyle(element).fontSize)))
          : 0;
        const overflowElements = [...document.body.querySelectorAll("*")]
          .filter((element) => {
            const style = getComputedStyle(element);
            const positionedLayer = element.closest(
              '.editorial-hero__print, [aria-hidden="true"][data-hero-wash], [data-hero-paper-edge]',
            );
            if (
              style.position === "fixed" || style.position === "absolute" ||
              positionedLayer
            ) return false;
            const box = element.getBoundingClientRect();
            return box.width > 0 && (box.x < -1 || box.right > innerWidth + 1);
          })
          .slice(0, 20)
          .map((element) => ({
            tag: element.tagName,
            className: element.className?.toString?.() || "",
            x: element.getBoundingClientRect().x,
            right: element.getBoundingClientRect().right,
          }));
        const article = articles[0];
        return {
          publicationMode,
          expectedOrigin,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || "",
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          openGraphType: document.querySelector('meta[property="og:type"]')?.content || "",
          canonical,
          contentStatus: root?.getAttribute("data-content-status") || "",
          signature: root?.getAttribute("data-signature-device") || "",
          h1,
          h2,
          h3,
          headingsFit,
          anchors,
          hero: {
            anchorCount: hero?.querySelectorAll("a[href]").length || 0,
            buttonCount: hero?.querySelectorAll("button[data-hero-cta]").length || 0,
            buttonTarget: heroButton?.getAttribute("data-hero-scroll-target") || "",
            buttonControls: heroButton?.getAttribute("aria-controls") || "",
            buttonLabel: normalize(heroButton?.textContent || ""),
            decorativePrintCount: [...(hero?.querySelectorAll(
              'figure[data-hero-print="left"], figure[data-hero-print="right"]',
            ) || [])].filter((figure) =>
              figure.getAttribute("aria-hidden") === "true" &&
              figure.querySelector("img")?.alt === "",
            ).length,
          },
          bylineValues,
          bylineHasDate: Boolean(byline?.querySelector("time")) ||
            /\b(?:19|20)\d{2}\b/.test(byline?.textContent || ""),
          faqDetails,
          renderedImages,
          imageContractMatches,
          schema: {
            articleCount: articles.length,
            faqCount: faqSchemas.length,
            breadcrumbCount: breadcrumbs.length,
            topLevelServiceCount: topLevelServices.length,
            unsafe: unsafeSchema,
            article,
            articleAbout: Array.isArray(article?.about)
              ? article.about.map((item) => [item?.["@type"], item?.name])
              : [],
            articleCities: Array.isArray(article?.spatialCoverage)
              ? article.spatialCoverage.map((item) => item?.name)
              : [],
            faqEntities: faqSchemas[0]?.mainEntity || [],
            breadcrumbItems: breadcrumbs[0]?.itemListElement || [],
          },
          stylesheetCount: [...document.querySelectorAll('link[rel="stylesheet"]')]
            .map((link) => link.getAttribute("href") || "")
            .filter((href) =>
              /journal-newborn-comparison-page[^/]*\.css(?:[?#]|$)/.test(href),
            ).length,
          placeholderLeak:
            /\[(?:PENDIENTE|VALIDAR|FECHA)|CONTENT PENDING/i.test(
              document.body.innerText,
            ),
          minimumBodyFont,
          horizontalOverflow:
            document.documentElement.scrollWidth >
              document.documentElement.clientWidth + 1,
          overflowElements,
        };
      },
      {
        routePath: route,
        originCandidates: origins,
        expectedImages: expected.images,
      },
    );

    const origin = audit.expectedOrigin;
    const canonical = `${origin}${route}`;
    const article = audit.schema.article;
    const articlePass =
      audit.schema.articleCount === 1 && audit.schema.faqCount === 1 &&
      audit.schema.breadcrumbCount === 1 &&
      audit.schema.topLevelServiceCount === 0 && !audit.schema.unsafe &&
      article?.["@id"] === `${canonical}#webpage` && article?.url === canonical &&
      article?.name === expected.title && article?.description === expected.description &&
      article?.headline === expected.title &&
      article?.author?.["@id"] === `${origin}/#lisa` &&
      article?.publisher?.["@id"] === `${origin}/#business` &&
      article?.image === `${origin}/uploads/richland-mother-newborn-at-home.jpg` &&
      article?.primaryImageOfPage?.url ===
        `${origin}/uploads/richland-mother-newborn-at-home.jpg` &&
      article?.isPartOf?.["@id"] === `${origin}/#website` &&
      article?.mainEntityOfPage?.["@id"] === canonical &&
      article?.inLanguage === "en-US" &&
      !Object.hasOwn(article || {}, "datePublished") &&
      !Object.hasOwn(article || {}, "dateModified") &&
      JSON.stringify(audit.schema.articleAbout) ===
        JSON.stringify([
          ["Thing", "Newborn photography"],
          ["Place", "Tri-Cities, Washington"],
        ]) &&
      JSON.stringify(audit.schema.articleCities) ===
        JSON.stringify(["Richland", "Kennewick", "Pasco"]) &&
      article?.spatialCoverage?.[0]?.containedInPlace?.["@type"] === "State" &&
      article?.spatialCoverage?.[0]?.containedInPlace?.name === "Washington";
    const faqPass =
      audit.schema.faqEntities.length === 3 &&
      expected.faq.every((pair, index) =>
        audit.schema.faqEntities[index]?.["@type"] === "Question" &&
        audit.schema.faqEntities[index]?.acceptedAnswer?.["@type"] === "Answer" &&
        audit.schema.faqEntities[index]?.name === pair.question &&
        audit.schema.faqEntities[index]?.acceptedAnswer?.text === pair.answer &&
        audit.faqDetails[index]?.question === pair.question &&
        audit.faqDetails[index]?.answer === pair.answer,
      );
    const expectedBreadcrumbs = [
      { position: 1, name: "Home", item: `${origin}/` },
      { position: 2, name: "Journal", item: `${origin}/journal/` },
      {
        position: 3,
        name: "In-Home vs. Studio Newborn Photography",
        item: canonical,
      },
    ];
    const breadcrumbPass =
      audit.schema.breadcrumbItems.length === 3 &&
      audit.schema.breadcrumbItems.every((item, index) =>
        item?.["@type"] === "ListItem" &&
        item?.position === expectedBreadcrumbs[index].position &&
        item?.name === expectedBreadcrumbs[index].name &&
        item?.item === expectedBreadcrumbs[index].item,
      );
    const imagePass =
      audit.imageContractMatches && audit.renderedImages.length === 9 &&
      audit.renderedImages.filter((image) => image.alt).length === 7 &&
      audit.renderedImages.every((image, index) =>
        image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 &&
        image.width > 0 && image.height > 0 && image.renderedWidth > 0 &&
        image.renderedHeight > 0 &&
        image.loading === (index < 3 ? "eager" : "lazy") &&
        image.decoding === "async" &&
        (index === 1 || index === 2 ? image.decorative : !image.decorative) &&
        (index === 0
          ? image.fetchpriority === "high"
          : image.fetchpriority !== "high") &&
        image.responsivePathCount >= 2 && image.allResponsiveWebp &&
        /\.webp$/.test(image.currentPath) && image.ratioDelta < 0.01,
      );
    const focusPass =
      heroButtonFocus.active && heroButtonFocus.outlineStyle !== "none" &&
      heroButtonFocus.outlineWidth >= 2 && heroButtonFocus.outlineOffset >= 3 &&
      heroButtonFocus.width >= 44 && heroButtonFocus.height >= 44 &&
      detailKeyboard.every((item) =>
        item.toggled && item.restored && item.focus.active &&
        item.focus.outlineStyle !== "none" && item.focus.outlineWidth >= 2 &&
        item.focus.outlineOffset >= 3 && item.focus.width >= 44 &&
        item.focus.height >= 44,
      ) &&
      anchorFocus.length === 3 && anchorFocus.every((item) =>
        item.active && item.outlineStyle !== "none" &&
        item.outlineWidth >= 2 && item.outlineOffset >= 3 &&
        item.width >= 44 && item.height >= 44,
      );
    const checks = {
      response: Boolean(response?.ok()),
      mode: audit.publicationMode === "release" || audit.publicationMode === "staging",
      publication:
        audit.contentStatus === "draft" && audit.signature === "overlap" &&
        audit.robots === "noindex, nofollow, noarchive" &&
        audit.canonical === canonical && audit.openGraphType === "article",
      metadata:
        audit.title === expected.title && audit.description === expected.description,
      headings:
        JSON.stringify(audit.h1) === JSON.stringify(expected.h1) &&
        JSON.stringify(audit.h2) === JSON.stringify(expected.h2) &&
        JSON.stringify(audit.h3) === JSON.stringify(expected.h3) &&
        audit.headingsFit,
      links: JSON.stringify(audit.anchors) === JSON.stringify(expected.anchors),
      hero:
        audit.hero.anchorCount === 0 && audit.hero.buttonCount === 1 &&
        audit.hero.buttonTarget === "the-short-answer" &&
        audit.hero.buttonControls === "the-short-answer" &&
        audit.hero.buttonLabel === "Read the comparison" &&
        audit.hero.decorativePrintCount === 2 &&
        heroScroll.targetFocused && heroScroll.scrollY > 0 &&
        heroScroll.targetTop >= 0 && heroScroll.targetTop <= 300,
      byline:
        JSON.stringify(audit.bylineValues) ===
          JSON.stringify([
            "By Lisa Weiss",
            "It's A Keeper Photography",
            "Richland, WA",
          ]) && !audit.bylineHasDate,
      faq:
        audit.faqDetails.length === 3 &&
        audit.faqDetails.every((item) => item.visible && item.summaryTarget) &&
        JSON.stringify(audit.faqDetails.map(({ question, answer }) => ({
          question,
          answer,
        }))) === JSON.stringify(expected.faq) &&
        JSON.stringify(audit.faqDetails.map((item) => item.open)) ===
          JSON.stringify([true, false, false]),
      schema: articlePass && faqPass && breadcrumbPass,
      images: imagePass,
      cssIsolation: audit.stylesheetCount === 1,
      focus: focusPass,
      copySafety: !audit.placeholderLeak && audit.minimumBodyFont >= 16,
      noOverflow:
        !audit.horizontalOverflow && audit.overflowElements.length === 0,
      runtime:
        consoleErrors.length === 0 && pageErrors.length === 0 &&
        failedSameOriginRequests.length === 0 &&
        failedSameOriginResponses.length === 0,
    };
    const viewportFailures = Object.entries(checks)
      .filter(([, pass]) => !pass)
      .map(([name]) => name);
    if (viewportFailures.length) {
      failures.push(
        `${viewport.id}px (${audit.publicationMode}): ${viewportFailures.join(", ")}`,
      );
    }

    const artifactRoot =
      `.artifacts/newborn-comparison/final/${audit.publicationMode}-${viewport.id}`;
    await page.screenshot({
      path: `${artifactRoot}-full.png`,
      fullPage: true,
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    await page.locator("#the-honest-comparison").screenshot({
      path: `${artifactRoot}-comparison.png`,
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    await page.locator("#common-questions").screenshot({
      path: `${artifactRoot}-faq.png`,
      scale: "css",
      type: "png",
      animations: "disabled",
    });

    results.push({
      viewport: viewport.id,
      publicationMode: audit.publicationMode,
      checks,
      heroScroll,
      detailKeyboard,
      anchorFocus,
      audit,
      consoleErrors,
      pageErrors,
      failedSameOriginRequests,
      failedSameOriginResponses,
      screenshots: [
        `${artifactRoot}-full.png`,
        `${artifactRoot}-comparison.png`,
        `${artifactRoot}-faq.png`,
      ],
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onRequestFailed);
    page.off("response", onResponse);
  }

  await page.goto(`${baseUrl}/journal/when-to-book-senior-pictures-tri-cities/`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  const leakedStylesheets = await page.locator(
    'link[rel="stylesheet"][href*="journal-newborn-comparison-page"]',
  ).count();
  if (leakedStylesheets !== 0) {
    failures.push("Newborn Comparison route stylesheet leaked into Senior Timing.");
  }

  if (failures.length) {
    throw new Error(
      `Newborn Comparison responsive QA failed:\n${failures.join("\n")}`,
    );
  }
  return results;
}
