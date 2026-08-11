async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/journal/when-to-book-senior-pictures-tri-cities/";
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
    title: "When to Take Senior Pictures: A Photographer's Timeline",
    description:
      "When should you take senior pictures — and when is it too late? A 20-year senior photographer shares the real timeline, season by season, plus booking tips.",
    h1: ["When Should You Take Senior Pictures?"],
    h2: [
      "The Short Answer",
      "When Are You Supposed to Take Senior Pictures?",
      "Season by Season: What Each One Gives You",
      "When Is It Too Late to Take Senior Pictures?",
      "What's the Best Time of Day for Senior Pictures Outside?",
      "The Tri-Cities Booking Calendar (What Nobody Tells You)",
      "Quick Answers",
      "Whenever You Shoot, Make It Yours",
    ],
    h3: [
      "Spring of junior year",
      "Summer before senior year",
      "Early fall of senior year",
      "Winter",
      "Junior or senior year?",
      "Before or after getting braces off?",
      "Is winter too cold?",
    ],
    anchors: [
      {
        href: "/senior-photographer-tri-cities-wa/",
        label: "see how senior sessions work",
      },
      {
        href: "/senior-photographer-tri-cities-wa/",
        label: "See how senior sessions work",
      },
      {
        href: "/journal/family-photo-locations-tri-cities/",
        label: "Best places to take pictures in the Tri-Cities",
      },
      { href: "/contact/", label: "Check my calendar" },
    ],
    images: [
      {
        src: "/uploads/journal-senior-golden-hour-tricities.jpg",
        alt: "High school senior in a white dress standing among softly lit branches.",
      },
      { src: "/uploads/west-richland-senior-woodpile-portrait.jpg", alt: "" },
      { src: "/uploads/richland-senior-autumn-dress.jpg", alt: "" },
      {
        src: "/uploads/senior-session-summer-light-richland.jpg",
        alt: "High school senior in a white dress and tan hat standing in golden grass.",
      },
      {
        src: "/uploads/pasco-senior-white-dress-seated-portrait.jpg",
        alt: "High school senior in a white dress seated beneath leafy branches.",
      },
      {
        src: "/uploads/pasco-senior-airplane-portrait.jpg",
        alt: "High school senior in a white shirt leaning beside a small airplane.",
      },
      {
        src: "/uploads/richland-senior-autumn-portrait.jpg",
        alt: "High school senior standing in front of golden autumn foliage.",
      },
      {
        src: "/uploads/richland-senior-suit-portrait.jpg",
        alt: "High school senior in a dark suit leaning against a concrete column.",
      },
      {
        src: "/uploads/richland-senior-seated-golden-hour.jpg",
        alt: "High school senior with glasses seated in warm evening grass.",
      },
      {
        src: "/uploads/kennewick-senior-riverside-portrait.jpg",
        alt: "High school senior standing beside water beneath leafy branches.",
      },
      {
        src: "/uploads/about-story-senior-horse-tricities.jpg",
        alt: "High school senior walking with a paint horse across dry grass.",
      },
    ],
    quickAnswers: [
      {
        question: "Junior or senior year?",
        answer:
          "Either. Spring junior year or summer/fall senior year are both ideal.",
      },
      {
        question: "Before or after getting braces off?",
        answer:
          "After, if the timing is close — or we celebrate the smile you have now. Your call.",
      },
      {
        question: "Is winter too cold?",
        answer:
          "We plan around it: shorter sets, warm layers between shots, and light that's worth it.",
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
    await page.locator(".senior-timing-page").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);

    const images = page.locator(".senior-timing-page img");
    for (let index = 0; index < await images.count(); index += 1) {
      const image = images.nth(index);
      if (index >= 3) await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode().catch(() => undefined));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const heroButton = page.locator(
      '.senior-timing-page [data-editorial-hero-page="journal"] button[data-hero-cta]',
    );
    await heroButton.focus();
    const heroButtonFocus = await heroButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        active: document.activeElement === element,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
        outlineOffset: Number.parseFloat(style.outlineOffset),
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
    const details = page.locator(".senior-timing-faq__list details");
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
    const anchors = page.locator(".senior-timing-page a[href]");
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
        };
      }));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const audit = await page.evaluate(
      ({ routePath, originCandidates, expectedImages }) => {
        const root = document.querySelector(".senior-timing-page");
        const hero = root?.querySelector('[data-editorial-hero-page="journal"]');
        const seasonSheet = root?.querySelector(
          ".senior-timing-seasons__contact-sheet",
        );
        const seasonItems = [...(seasonSheet?.querySelectorAll(
          ":scope > .senior-timing-season",
        ) || [])];
        const faqDetails = [...(root?.querySelectorAll(
          ".senior-timing-faq__list details",
        ) || [])];
        const normalize = (value = "") => value
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\s+/g, " ")
          .trim();
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
        const visibleFaqPairs = [
          {
            question: normalize(root?.querySelector("h1")?.textContent || ""),
            answer: normalize(root?.querySelector(
              "#the-short-answer .senior-timing-answer__arch p",
            )?.textContent || ""),
          },
          {
            question: normalize(root?.querySelector(
              "#when-is-it-too-late h2",
            )?.textContent || ""),
            answer: normalize(root?.querySelector(
              "#when-is-it-too-late p",
            )?.textContent || ""),
          },
          {
            question: normalize(root?.querySelector(
              "#best-time-of-day h2",
            )?.textContent || ""),
            answer: normalize(root?.querySelector(
              "#best-time-of-day p",
            )?.textContent || ""),
          },
        ];
        const faqEntities = faqSchemas[0]?.mainEntity || [];
        const renderedImages = [...(root?.querySelectorAll("img") || [])].map(
          (image) => {
            const picture = image.closest("picture");
            const box = image.getBoundingClientRect();
            const width = Number(image.getAttribute("width"));
            const height = Number(image.getAttribute("height"));
            const currentPath = image.currentSrc
              ? new URL(image.currentSrc).pathname
              : "";
            const selectedWidth = Number(
              currentPath.match(/-(\d+)\.webp$/)?.[1] || 0,
            );
            const webpSources = [...(picture?.querySelectorAll(
              'source[type="image/webp"]',
            ) || [])];
            const responsivePaths = webpSources.flatMap((source) =>
              (source.getAttribute("srcset") || "")
                .split(",")
                .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
                .filter(Boolean),
            );
            return {
              src: image.getAttribute("src") || "",
              alt: image.getAttribute("alt") ?? null,
              decorative: Boolean(image.closest('[aria-hidden="true"]')),
              currentPath,
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
              width,
              height,
              renderedWidth: box.width,
              renderedHeight: box.height,
              loading: image.getAttribute("loading"),
              decoding: image.getAttribute("decoding"),
              fetchpriority: image.getAttribute("fetchpriority"),
              selectedWidth,
              webpSourceCount: webpSources.length,
              responsivePathCount: responsivePaths.length,
              allResponsiveWebp: responsivePaths.every((asset) =>
                /\.webp$/.test(new URL(asset, location.href).pathname),
              ),
              ratioDelta:
                image.naturalWidth > 0 && image.naturalHeight > 0 &&
                width > 0 && height > 0
                  ? Math.abs(
                      image.naturalWidth / image.naturalHeight - width / height,
                    )
                  : Infinity,
            };
          },
        );
        const imageContractMatches = renderedImages.length === expectedImages.length &&
          renderedImages.every((image, index) =>
            image.src === expectedImages[index].src &&
            image.alt === expectedImages[index].alt,
          );
        const quickAnswers = faqDetails.map((detail) => ({
          question: normalize(detail.querySelector("summary")?.textContent || ""),
          answer: normalize(detail.querySelector(
            ".senior-timing-faq__answer",
          )?.textContent || ""),
          open: detail.open,
          visible:
            detail.getBoundingClientRect().width > 0 &&
            detail.getBoundingClientRect().height > 0 &&
            getComputedStyle(detail).display !== "none" &&
            getComputedStyle(detail).visibility !== "hidden",
          summaryTarget: (() => {
            const box = detail.querySelector("summary")?.getBoundingClientRect();
            return Boolean(box && box.width >= 44 && box.height >= 44);
          })(),
        }));
        const bodyNodes = [...(root?.querySelectorAll("p, li") || [])].filter(
          (node) => {
            const style = getComputedStyle(node);
            const box = node.getBoundingClientRect();
            return box.width > 0 && box.height > 0 &&
              style.display !== "none" && style.visibility !== "hidden";
          },
        );
        const clippedText = [];
        if (root) {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
              if (!node.textContent?.trim() || !node.parentElement) {
                return NodeFilter.FILTER_REJECT;
              }
              const style = getComputedStyle(node.parentElement);
              return style.display === "none" || style.visibility === "hidden"
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT;
            },
          });
          while (walker.nextNode()) {
            const range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            for (const box of range.getClientRects()) {
              if (box.left < -1 || box.right > innerWidth + 1) {
                clippedText.push(
                  normalize(walker.currentNode.textContent || "").slice(0, 80),
                );
              }
            }
          }
        }
        const article = articles[0] || null;
        const articleAbout = Array.isArray(article?.about)
          ? article.about.map((item) => [item?.["@type"], item?.name])
          : [];
        const articleCities = Array.isArray(article?.spatialCoverage)
          ? article.spatialCoverage.map((item) => item?.name)
          : [];
        const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
        const byline = root?.querySelector(".senior-timing-byline");
        const bylineValues = [...(byline?.querySelectorAll(
          'span:not([aria-hidden="true"])',
        ) || [])].map((node) => normalize(node.textContent || ""));
        const seasonRects = seasonItems.map(rect);
        const seasonColumnCount = seasonSheet
          ? getComputedStyle(seasonSheet).gridTemplateColumns
              .split(/\s+/)
              .filter(Boolean).length
          : 0;
        const stylesheets = [...document.querySelectorAll(
          'link[rel="stylesheet"]',
        )].map((link) => link.getAttribute("href") || "");

        return {
          publicationMode,
          expectedOrigin,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || "",
          canonical,
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          openGraphType: document.querySelector('meta[property="og:type"]')?.content || "",
          contentStatus: root?.getAttribute("data-content-status"),
          signature: root?.getAttribute("data-signature-device"),
          directionContract: document.documentElement.innerHTML.includes(
            "Senior Timing Field Guide: shared EditorialHero",
          ),
          h1: [...(root?.querySelectorAll("h1") || [])].map((node) =>
            normalize(node.textContent || ""),
          ),
          h2: [...(root?.querySelectorAll("h2") || [])].map((node) =>
            normalize(node.textContent || ""),
          ),
          h3: [...(root?.querySelectorAll("h3") || [])].map((node) =>
            normalize(node.textContent || ""),
          ),
          headingsFit: [...(root?.querySelectorAll("h1, h2, h3") || [])]
            .every((node) => node.scrollWidth <= node.clientWidth + 1),
          anchors: [...(root?.querySelectorAll("a[href]") || [])].map((anchor) => ({
            href: anchor.getAttribute("href") || "",
            label: normalize(anchor.textContent || ""),
          })),
          hero: {
            anchorCount: hero?.querySelectorAll("a[href]").length || 0,
            buttonCount: hero?.querySelectorAll("button[data-hero-cta]").length || 0,
            buttonTarget: hero?.querySelector("button[data-hero-cta]")
              ?.getAttribute("data-hero-scroll-target") || "",
            buttonControls: hero?.querySelector("button[data-hero-cta]")
              ?.getAttribute("aria-controls") || "",
            buttonLabel: normalize(hero?.querySelector(
              "button[data-hero-cta]",
            )?.textContent || ""),
          },
          bylineValues,
          bylineHasDate: Boolean(
            byline?.querySelector("time") ||
            /\b(?:19|20)\d{2}\b/.test(byline?.textContent || ""),
          ),
          quickAnswers,
          renderedImages,
          imageContractMatches,
          minimumBodyFont: Math.min(
            ...bodyNodes.map((node) => Number.parseFloat(
              getComputedStyle(node).fontSize,
            )),
          ),
          schema: {
            articleCount: articles.length,
            faqCount: faqSchemas.length,
            breadcrumbCount: breadcrumbs.length,
            topLevelServiceCount: topLevelServices.length,
            unsafe: unsafeSchema,
            article,
            articleAbout,
            articleCities,
            faqEntities,
            visibleFaqPairs,
            breadcrumbItems,
          },
          stylesheetCount: stylesheets.filter((href) =>
            /journal-senior-timing-page[^/]*\.css(?:[?#]|$)/.test(href),
          ).length,
          placeholderLeak:
            /\[(?:PENDIENTE|VALIDAR|FECHA)|CONTENT PENDING/i.test(
              document.body.innerText,
            ),
          horizontalOverflow:
            document.documentElement.scrollWidth >
              document.documentElement.clientWidth + 1,
          clippedText,
          sectionBounds: [...(root?.querySelectorAll(
            ":scope > header, :scope > section, :scope > div",
          ) || [])].map(rect),
          seasonColumnCount,
          seasonRects,
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
      audit.schema.articleCount === 1 &&
      audit.schema.faqCount === 1 &&
      audit.schema.breadcrumbCount === 1 &&
      audit.schema.topLevelServiceCount === 0 &&
      !audit.schema.unsafe &&
      article?.["@id"] === `${canonical}#webpage` &&
      article?.url === canonical &&
      article?.name === expected.title &&
      article?.description === expected.description &&
      article?.headline === expected.title &&
      article?.author?.["@id"] === `${origin}/#lisa` &&
      article?.publisher?.["@id"] === `${origin}/#business` &&
      article?.image ===
        `${origin}/uploads/journal-senior-golden-hour-tricities.jpg` &&
      article?.primaryImageOfPage?.url ===
        `${origin}/uploads/journal-senior-golden-hour-tricities.jpg` &&
      article?.isPartOf?.["@id"] === `${origin}/#website` &&
      article?.mainEntityOfPage?.["@id"] === canonical &&
      article?.inLanguage === "en-US" &&
      !Object.hasOwn(article || {}, "datePublished") &&
      !Object.hasOwn(article || {}, "dateModified") &&
      JSON.stringify(audit.schema.articleAbout) ===
        JSON.stringify([
          ["Thing", "Senior pictures"],
          ["Place", "Tri-Cities, Washington"],
        ]) &&
      JSON.stringify(audit.schema.articleCities) ===
        JSON.stringify(["Richland", "Kennewick", "Pasco"]) &&
      article?.spatialCoverage?.[0]?.containedInPlace?.["@type"] === "State" &&
      article?.spatialCoverage?.[0]?.containedInPlace?.name === "Washington";
    const faqPass =
      audit.schema.faqEntities.length === 3 &&
      audit.schema.visibleFaqPairs.every((pair, index) =>
        audit.schema.faqEntities[index]?.["@type"] === "Question" &&
        audit.schema.faqEntities[index]?.acceptedAnswer?.["@type"] === "Answer" &&
        audit.schema.faqEntities[index]?.name === pair.question &&
        audit.schema.faqEntities[index]?.acceptedAnswer?.text === pair.answer,
      );
    const expectedBreadcrumbs = [
      { position: 1, name: "Home", item: `${origin}/` },
      { position: 2, name: "Journal", item: `${origin}/journal/` },
      { position: 3, name: "When to Take Senior Pictures", item: canonical },
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
      audit.imageContractMatches &&
      audit.renderedImages.length === 11 &&
      audit.renderedImages.filter((image) => image.alt).length === 9 &&
      audit.renderedImages.every((image, index) =>
        image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 &&
        image.width > 0 && image.height > 0 &&
        image.renderedWidth > 0 && image.renderedHeight > 0 &&
        image.loading === (index < 3 ? "eager" : "lazy") &&
        image.decoding === "async" &&
        (index === 1 || index === 2 ? image.decorative : !image.decorative) &&
        (index === 0
          ? image.fetchpriority === "high"
          : image.fetchpriority !== "high") &&
        image.webpSourceCount > 0 && image.responsivePathCount >= 2 &&
        image.allResponsiveWebp && /\.webp$/.test(image.currentPath) &&
        image.selectedWidth >= image.renderedWidth * 0.85 &&
        image.ratioDelta < 0.01,
      );
    const seasonRects = audit.seasonRects;
    const tolerance = 3;
    const close = (left, right) => Math.abs(left - right) <= tolerance;
    const seasonLayoutPass = viewport.width > 1050
      ? audit.seasonColumnCount === 12 && seasonRects.length === 4 &&
        seasonRects[0].x < seasonRects[1].x &&
        seasonRects[2].x < seasonRects[3].x &&
        seasonRects[2].y > seasonRects[0].y &&
        seasonRects[3].y > seasonRects[1].y &&
        seasonRects[0].width > seasonRects[1].width + 30 &&
        seasonRects[2].width > seasonRects[3].width + 30
      : viewport.width > 767
        ? audit.seasonColumnCount === 2 && seasonRects.length === 4 &&
          close(seasonRects[0].y, seasonRects[1].y) &&
          close(seasonRects[2].y, seasonRects[3].y) &&
          close(seasonRects[0].x, seasonRects[2].x) &&
          close(seasonRects[1].x, seasonRects[3].x) &&
          close(seasonRects[0].width, seasonRects[1].width) &&
          seasonRects[2].y > seasonRects[0].y
        : audit.seasonColumnCount === 1 && seasonRects.length === 4 &&
          seasonRects.every((box, index) =>
            close(box.x, seasonRects[0].x) &&
            close(box.width, seasonRects[0].width) &&
            (index === 0 || box.y > seasonRects[index - 1].bottom),
          );
    const sectionsWithinViewport = audit.sectionBounds.every(
      (box) => box && box.x >= -1 && box.right <= viewport.width + 1,
    );
    const focusPass =
      heroButtonFocus.active && heroButtonFocus.outlineStyle !== "none" &&
      heroButtonFocus.outlineWidth >= 2 && heroButtonFocus.outlineOffset >= 3 &&
      detailKeyboard.every((item) =>
        item.toggled && item.restored && item.focus.active &&
        item.focus.outlineStyle !== "none" && item.focus.outlineWidth >= 2 &&
        item.focus.outlineOffset >= 3,
      ) &&
      anchorFocus.length === 4 && anchorFocus.every((item) =>
        item.active && item.outlineStyle !== "none" &&
        item.outlineWidth >= 2 && item.outlineOffset >= 3,
      );
    const checks = {
      response: Boolean(response?.ok()),
      mode: audit.publicationMode === "release" || audit.publicationMode === "staging",
      publication:
        audit.contentStatus === "draft" && audit.signature === "crossing-line" &&
        audit.robots === "noindex, nofollow, noarchive" &&
        audit.canonical === canonical && audit.openGraphType === "article",
      metadata:
        audit.title === expected.title && audit.description === expected.description,
      directionContract: audit.directionContract,
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
        audit.hero.buttonLabel === "Read the timeline" &&
        heroScroll.targetFocused && heroScroll.scrollY > 0 &&
        heroScroll.targetTop >= 0 && heroScroll.targetTop <= 300,
      byline:
        JSON.stringify(audit.bylineValues) ===
          JSON.stringify([
            "By Lisa Weiss",
            "It's A Keeper Photography",
            "Richland, WA",
          ]) && !audit.bylineHasDate,
      quickAnswers:
        audit.quickAnswers.length === 3 &&
        audit.quickAnswers.every((item) => item.visible && item.summaryTarget) &&
        JSON.stringify(audit.quickAnswers.map(({ question, answer }) => ({
          question,
          answer,
        }))) === JSON.stringify(expected.quickAnswers) &&
        JSON.stringify(audit.quickAnswers.map((item) => item.open)) ===
          JSON.stringify([true, false, false]),
      schema: articlePass && faqPass && breadcrumbPass,
      images: imagePass,
      cssIsolation: audit.stylesheetCount === 1,
      seasonLayout: seasonLayoutPass,
      focus: focusPass,
      copySafety: !audit.placeholderLeak && audit.minimumBodyFont >= 16,
      noOverflow:
        !audit.horizontalOverflow && audit.clippedText.length === 0 &&
        sectionsWithinViewport,
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
      `.artifacts/senior-timing/final/${audit.publicationMode}-${viewport.id}`;
    await page.screenshot({
      path: `${artifactRoot}-full.png`,
      fullPage: true,
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    await page.locator(".senior-timing-seasons").screenshot({
      path: `${artifactRoot}-seasons.png`,
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    await page.locator(".senior-timing-faq").screenshot({
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
        `${artifactRoot}-seasons.png`,
        `${artifactRoot}-faq.png`,
      ],
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onRequestFailed);
    page.off("response", onResponse);
  }

  if (failures.length) {
    throw new Error(`Senior Timing responsive QA failed:\n${failures.join("\n")}`);
  }
  return results;
}
