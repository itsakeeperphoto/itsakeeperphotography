async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/journal/branding-photos-vs-headshots/";
  const origins = {
    release: "https://www.itsakeeperphotography.com",
    staging: "https://itsakeeperphotography.netlify.app",
  };
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
    { id: "1728", width: 1728, height: 963 },
  ];
  const expected = {
    title: "Branding Photos vs. Headshots: What's the Difference?",
    description:
      "What are branding photos, how are they different from headshots, and which does your business need first? A working photographer's plain-English breakdown.",
    h1: ["Branding Photos vs. Headshots: What's the Difference?"],
    h2: [
      "The Short Answer",
      "What Are Branding Photos?",
      "What Is a Headshot?",
      "Side by Side: Branding Photos vs. Headshots",
      "Which Does Your Business Need First?",
      "What Happens in a Branding Session?",
      "Common Questions",
      "Show Them Who You Are",
    ],
    h3: [
      "Start with a headshot if…",
      "Start with a branding session if…",
      "The honest truth: most businesses end up with both",
      "What should I wear for branding photos?",
      "How often should branding photos be updated?",
      "Are branding photos worth it for a very small business?",
    ],
    anchors: [
      {
        href: "/branding-photographer-tri-cities-wa/",
        label: "Branding photography in the Tri-Cities",
      },
      {
        href: "/headshot-photographer-tri-cities-wa/",
        label: "Just need the headshot?",
      },
      { href: "/contact/", label: "Start planning" },
    ],
    images: [
      {
        src: "/uploads/branding-chef-kitchen-richland-wa.jpg",
        alt: "Chef smiling while stirring vegetables in a modern kitchen during a Richland branding session.",
      },
      { src: "/uploads/professional-headshot-woman-neutral-backdrop.jpg", alt: "" },
      { src: "/uploads/pianist-creative-branding-portrait-richland-wa.jpg", alt: "" },
      {
        src: "/uploads/business-professional-working-laptop-richland-wa.jpg",
        alt: "Business professional working at a laptop during a Richland branding session.",
      },
      {
        src: "/uploads/personal-branding-portrait-kitchen-west-richland-wa.jpg",
        alt: "Business owner standing beside a kitchen island during a West Richland branding session.",
      },
      {
        src: "/uploads/businesswoman-working-desk-richland-wa.jpg",
        alt: "Business owner writing at her desk during a Richland workplace branding session.",
      },
      {
        src: "/uploads/professional-headshot-man-blue-shirt-kennewick-wa.jpg",
        alt: "Smiling man in a blue shirt photographed against a warm stone backdrop in Kennewick.",
      },
      {
        src: "/uploads/professional-headshot-woman-black-top-kennewick-wa.jpg",
        alt: "Smiling woman in a black top photographed during a Kennewick team headshot session.",
      },
      {
        src: "/uploads/business-partners-office-portrait-richland-wa.jpg",
        alt: "Two business professionals posing together in their Richland office.",
      },
      {
        src: "/uploads/chef-saute-pan-branding-detail-richland-wa.jpg",
        alt: "Chef stirring vegetables in a pan during a close-up Richland branding photograph.",
      },
      { src: "/uploads/business-team-meeting-richland-wa.jpg", alt: "" },
    ],
    comparisonRows: [
      ["What you get", "1–3 polished portraits", "A full library of varied images"],
      ["Focus", "You", "You + your work + your space + your story"],
      ["Session length", "Under an hour", "Half a day, typically"],
      ["Where it lives", "LinkedIn, team page, bios", "Website, social, marketing, press"],
      ["Refresh cycle", "Every 2–3 years", "1–2 times a year"],
      [
        "Best first step for",
        "Employees, job seekers, professionals",
        "Business owners, personal brands",
      ],
    ],
    checklist: [
      "Portraits of you that feel like your brand — not stiff, not generic",
      "You doing the work: hands, tools, process, craft",
      "Your space — studio, shop, office, or wherever the magic happens",
      "Details: products, textures, materials, the things clients notice",
      "Lifestyle moments that show the experience of working with you",
    ],
    faq: [
      {
        question: "What should I wear for branding photos?",
        answer:
          "Your brand's colors, your real working clothes, and one \"elevated\" option. We plan it together — the goal is recognizably you, one notch polished.",
      },
      {
        question: "How often should branding photos be updated?",
        answer:
          "Most businesses refresh once or twice a year as offers, seasons and spaces change. Headshots: every two to three years, or after any big change.",
      },
      {
        question: "Are branding photos worth it for a very small business?",
        answer:
          "Small businesses benefit most — you are the brand. In a community like the Tri-Cities, people hire the person they feel they already know, and branding photos are how they meet you before the first call.",
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
          message.text() + " " + (message.location().url || ""),
        )
      ) {
        consoleErrors.push(message.text());
      }
    };
    const onPageError = (error) => pageErrors.push(error.message);
    const onRequestFailed = (request) => {
      if (request.url().startsWith(baseUrl)) {
        failedSameOriginRequests.push(
          request.method() + " " + request.url() + " — " +
            (request.failure()?.errorText || "failed"),
        );
      }
    };
    const onResponse = (response) => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) {
        failedSameOriginResponses.push(response.status() + " " + response.url());
      }
    };
    page.on("console", onConsole);
    page.on("pageerror", onPageError);
    page.on("requestfailed", onRequestFailed);
    page.on("response", onResponse);

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto(baseUrl + route, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    const root = page.locator(".branding-headshots-page");
    await root.waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);

    const images = root.locator("img");
    for (let index = 0; index < await images.count(); index += 1) {
      const image = images.nth(index);
      if (index >= 3) await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode().catch(() => undefined));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const heroButton = root.locator(
      '[data-editorial-hero-page="journal"] button[data-hero-cta]',
    );
    await heroButton.focus();
    const heroButtonFocus = await heroButton.evaluate((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return {
        active: document.activeElement === element,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
        outlineOffset: Number.parseFloat(style.outlineOffset),
        width: box.width,
        height: box.height,
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
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      };
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const detailKeyboard = [];
    const details = root.locator("#common-questions details");
    for (const [index, key] of [[1, "Enter"], [2, "Space"]]) {
      const detail = details.nth(index);
      const summary = detail.locator("summary");
      await summary.focus();
      const focus = await summary.evaluate((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return {
          active: document.activeElement === element,
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          outlineOffset: Number.parseFloat(style.outlineOffset),
          width: box.width,
          height: box.height,
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
    const anchors = root.locator("a[href]");
    for (let index = 0; index < await anchors.count(); index += 1) {
      const anchor = anchors.nth(index);
      await anchor.scrollIntoViewIfNeeded();
      await anchor.focus();
      anchorFocus.push(await anchor.evaluate((element) => {
        const parseColor = (value) => {
          const channels = value.match(/[\d.]+/g)?.map(Number) || [];
          return channels.length >= 3 ? channels.slice(0, 3) : [0, 0, 0];
        };
        const luminance = (value) => {
          const [red, green, blue] = parseColor(value).map((channel) => {
            const normalized = channel / 255;
            return normalized <= 0.04045
              ? normalized / 12.92
              : ((normalized + 0.055) / 1.055) ** 2.4;
          });
          return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
        };
        const contrast = (foreground, background) => {
          const first = luminance(foreground);
          const second = luminance(background);
          return (Math.max(first, second) + 0.05) /
            (Math.min(first, second) + 0.05);
        };
        const nearestOpaqueBackground = (start) => {
          let node = start;
          while (node) {
            const background = getComputedStyle(node).backgroundColor;
            const alpha = Number(background.match(/[\d.]+/g)?.[3] ?? 1);
            if (background !== "transparent" && alpha > 0) return background;
            node = node.parentElement;
          }
          return getComputedStyle(document.body).backgroundColor;
        };
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        const surfaceColor = nearestOpaqueBackground(element);
        return {
          href: element.getAttribute("href"),
          active: document.activeElement === element,
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          outlineOffset: Number.parseFloat(style.outlineOffset),
          outlineColor: style.outlineColor,
          surfaceColor,
          outlineContrast: contrast(style.outlineColor, surfaceColor),
          width: box.width,
          height: box.height,
        };
      }));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const audit = await page.evaluate(
      ({ routePath, originCandidates, contract }) => {
        const rootElement = document.querySelector(".branding-headshots-page");
        const normalize = (value = "") => value
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const accessibleText = (element) => {
          if (!element) return "";
          const clone = element.cloneNode(true);
          clone.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
          return normalize(clone.textContent || "");
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
        const publicationMode = canonical === originCandidates.release + routePath
          ? "release"
          : canonical === originCandidates.staging + routePath
            ? "staging"
            : "unknown";
        const expectedOrigin = publicationMode === "release"
          ? originCandidates.release
          : publicationMode === "staging"
            ? originCandidates.staging
            : "";
        const h1 = [...(rootElement?.querySelectorAll("h1") || [])].map((item) =>
          normalize(item.textContent || ""));
        const h2 = [...(rootElement?.querySelectorAll("h2") || [])].map((item) =>
          normalize(item.textContent || ""));
        const h3 = [...(rootElement?.querySelectorAll("h3") || [])].map((item) =>
          normalize(item.textContent || ""));
        const headingElements = [...(rootElement?.querySelectorAll("h1, h2, h3") || [])];
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
        const renderedImages = [...(rootElement?.querySelectorAll("img") || [])].map(
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
            const intrinsicWidth = Number(image.getAttribute("width"));
            const intrinsicHeight = Number(image.getAttribute("height"));
            const intrinsicRatio = intrinsicHeight
              ? intrinsicWidth / intrinsicHeight
              : 0;
            return {
              src: image.getAttribute("src") || "",
              alt: image.getAttribute("alt") || "",
              intrinsicWidth,
              intrinsicHeight,
              loading: image.getAttribute("loading"),
              decoding: image.getAttribute("decoding"),
              fetchpriority: image.getAttribute("fetchpriority"),
              sizes: image.getAttribute("sizes") ||
                picture?.querySelector('source[type="image/webp"]')?.getAttribute("sizes") || "",
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
              renderedWidth: box.width,
              renderedHeight: box.height,
              decorative: image.alt === "",
              ariaHiddenContext: Boolean(image.closest('[aria-hidden="true"]')),
              currentPath,
              selectedWidth: Number(currentPath.match(/-(\d+)\.webp$/)?.[1] || 0),
              responsivePathCount: responsivePaths.length,
              allResponsiveWebp:
                responsivePaths.length > 0 &&
                responsivePaths.every((path) => /\.webp$/i.test(path)),
              ratioDelta: Math.abs(naturalRatio - intrinsicRatio),
            };
          },
        );
        const imageContractMatches = JSON.stringify(
          renderedImages.map(({ src, alt }) => ({ src, alt })),
        ) === JSON.stringify(contract.images);
        const imageSources = renderedImages.map((image) => image.src);
        const table = rootElement?.querySelector("#side-by-side table");
        const tableRows = [...(table?.querySelectorAll("tbody tr") || [])];
        const tableSemantics = {
          labelledBy: table?.getAttribute("aria-labelledby") || "",
          headerTexts: [...(table?.querySelectorAll("thead th") || [])].map(
            (cell) => normalize(cell.textContent || ""),
          ),
          columnScopes: [...(table?.querySelectorAll("thead th") || [])].map(
            (cell) => cell.getAttribute("scope") || "",
          ),
          rowScopes: tableRows.map(
            (row) => row.querySelector("th")?.getAttribute("scope") || "",
          ),
          rows: tableRows.map((row) =>
            [...row.querySelectorAll(":scope > th, :scope > td")].map(
              (cell) => normalize(cell.textContent || ""),
            )),
        };
        const checklist = [...(rootElement?.querySelectorAll(
          "#what-are-branding-photos ul > li",
        ) || [])].map((item) => accessibleText(item));
        const faqDetails = [...(rootElement?.querySelectorAll(
          "#common-questions details",
        ) || [])].map((detail) => ({
          visible: !detail.hidden && detail.getAttribute("aria-hidden") !== "true",
          open: detail.open,
          question: accessibleText(detail.querySelector("summary")),
          answer: normalize(
            detail.querySelector(".branding-headshots-faq__answer")?.textContent || "",
          ),
          summaryTarget: (() => {
            const summary = detail.querySelector("summary");
            const box = summary?.getBoundingClientRect();
            return Boolean(summary?.tabIndex === 0 && box && box.width >= 44 && box.height >= 44);
          })(),
        }));
        const byline = rootElement?.querySelector(".branding-headshots-byline");
        const bylineValues = [...(byline?.querySelectorAll("span") || [])]
          .filter((item) => item.getAttribute("aria-hidden") !== "true")
          .map((item) => normalize(item.textContent || ""));
        const bylineTime = byline?.querySelector("time");
        const hero = rootElement?.querySelector('[data-editorial-hero-page="journal"]');
        const heroButton = hero?.querySelector("button[data-hero-cta]");
        const anchors = [...(rootElement?.querySelectorAll("a[href]") || [])].map(
          (anchor) => ({
            href: anchor.getAttribute("href") || "",
            label: accessibleText(anchor),
          }),
        );
        const visibleText = [...(rootElement?.querySelectorAll("p, li, td, th") || [])].filter(
          (element) => {
            const style = getComputedStyle(element);
            const box = element.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" &&
              box.width > 0 && box.height > 0;
          },
        );
        const minimumBodyFont = visibleText.length
          ? Math.min(...visibleText.map((element) =>
              Number.parseFloat(getComputedStyle(element).fontSize)))
          : 0;
        const parseColor = (value) => {
          const channels = value.match(/[\d.]+/g)?.map(Number) || [];
          return channels.length >= 3 ? channels.slice(0, 3) : [0, 0, 0];
        };
        const luminance = (value) => {
          const [red, green, blue] = parseColor(value).map((channel) => {
            const normalized = channel / 255;
            return normalized <= 0.04045
              ? normalized / 12.92
              : ((normalized + 0.055) / 1.055) ** 2.4;
          });
          return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
        };
        const contrast = (foreground, background) => {
          const first = luminance(foreground);
          const second = luminance(background);
          return (Math.max(first, second) + 0.05) /
            (Math.min(first, second) + 0.05);
        };
        const headshotParagraph = rootElement?.querySelector(
          ".branding-headshots-headshot__copy p",
        );
        const headshotSection = rootElement?.querySelector(
          ".branding-headshots-headshot",
        );
        const headshotTextContrast = headshotParagraph && headshotSection
          ? contrast(
            getComputedStyle(headshotParagraph).color,
            getComputedStyle(headshotSection).backgroundColor,
          )
          : 0;
        const versusSeam = rootElement?.querySelector(
          ".branding-headshots-comparison__seam",
        );
        const versusLabel = versusSeam?.querySelector(
          ".branding-headshots-comparison__versus",
        );
        const seamLines = [...(versusSeam?.querySelectorAll(
          ".branding-headshots-comparison__seam-line",
        ) || [])];
        const seamBox = versusSeam?.getBoundingClientRect();
        const versusBox = versusLabel?.getBoundingClientRect();
        const headshotProofBox = rootElement?.querySelector(
          ".branding-headshots-comparison__headshot",
        )?.getBoundingClientRect();
        const brandingProofBox = rootElement?.querySelector(
          ".branding-headshots-comparison__branding",
        )?.getBoundingClientRect();
        const comparisonSeam = {
          visible:
            Boolean(versusSeam && versusLabel && seamBox && versusBox) &&
            getComputedStyle(versusSeam).display !== "none" &&
            getComputedStyle(versusLabel).visibility !== "hidden" &&
            seamBox.width > 0 && seamBox.height > 0 &&
            versusBox.width > 0 && versusBox.height > 0,
          direction: getComputedStyle(versusSeam || document.body).flexDirection,
          lineCount: seamLines.length,
          linesVisible: seamLines.every((line) => {
            const box = line.getBoundingClientRect();
            const style = getComputedStyle(line);
            return style.visibility !== "hidden" && Number(style.opacity) > 0 &&
              box.width > 0 && box.height > 0;
          }),
          figureGap:
            headshotProofBox && brandingProofBox
              ? brandingProofBox.left - headshotProofBox.right
              : 0,
          seamWidth: seamBox?.width || 0,
          seamHeight: seamBox?.height || 0,
        };
        const hasHorizontalScroller = (element) => {
          let ancestor = element.parentElement;
          while (ancestor && ancestor !== document.body) {
            const style = getComputedStyle(ancestor);
            if (["auto", "scroll", "hidden", "clip"].includes(style.overflowX)) {
              return true;
            }
            ancestor = ancestor.parentElement;
          }
          return false;
        };
        const overflowElements = [...document.body.querySelectorAll("*")]
          .filter((element) => {
            const style = getComputedStyle(element);
            if (
              style.position === "fixed" || style.position === "absolute" ||
              element.closest(".editorial-hero__print") || hasHorizontalScroller(element)
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
        const clippedText = [];
        if (rootElement) {
          const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
              if (!node.textContent?.trim() || !node.parentElement) {
                return NodeFilter.FILTER_REJECT;
              }
              const style = getComputedStyle(node.parentElement);
              if (
                style.display === "none" || style.visibility === "hidden" ||
                hasHorizontalScroller(node.parentElement)
              ) return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            },
          });
          while (walker.nextNode()) {
            const range = document.createRange();
            range.selectNodeContents(walker.currentNode);
            for (const box of range.getClientRects()) {
              if (box.left < -1 || box.right > innerWidth + 1) {
                clippedText.push(normalize(walker.currentNode.textContent || "").slice(0, 80));
              }
            }
          }
        }
        return {
          publicationMode,
          expectedOrigin,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || "",
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          openGraphType: document.querySelector('meta[property="og:type"]')?.content || "",
          canonical,
          contentStatus: rootElement?.getAttribute("data-content-status") || "",
          signature: rootElement?.getAttribute("data-signature-device") || "",
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
            buttonLabel: accessibleText(heroButton),
            decorativePrintCount: [...(hero?.querySelectorAll(
              'figure[data-hero-print="left"], figure[data-hero-print="right"]',
            ) || [])].filter((figure) =>
              figure.getAttribute("aria-hidden") === "true" &&
              figure.querySelector("img")?.alt === "",
            ).length,
          },
          bylineValues,
          bylineTime: {
            label: normalize(bylineTime?.textContent || ""),
            datetime: bylineTime?.getAttribute("datetime") || "",
          },
          checklist,
          tableSemantics,
          faqDetails,
          renderedImages,
          imageContractMatches,
          uniqueImageSourceCount: new Set(imageSources).size,
          schema: {
            articleCount: articles.length,
            faqCount: faqSchemas.length,
            breadcrumbCount: breadcrumbs.length,
            topLevelServiceCount: topLevelServices.length,
            unsafe: unsafeSchema,
            article: articles[0],
            articleAbout: Array.isArray(articles[0]?.about)
              ? articles[0].about.map((item) => [item?.["@type"], item?.name])
              : [],
            articleCities: Array.isArray(articles[0]?.spatialCoverage)
              ? articles[0].spatialCoverage.map((item) => item?.name)
              : [],
            faqEntities: faqSchemas[0]?.mainEntity || [],
            breadcrumbItems: breadcrumbs[0]?.itemListElement || [],
          },
          stylesheetCount: [...document.querySelectorAll('link[rel="stylesheet"]')]
            .map((link) => link.getAttribute("href") || "")
            .filter((href) =>
              /journal-branding-vs-headshots-page[^/]*\.css(?:[?#]|$)/.test(href),
            ).length,
          directionContract: document.documentElement.innerHTML.includes(
            "Branding vs. Headshots Versus Axis",
          ),
          reducedMotion: {
            matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
            scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
          },
          placeholderLeak:
            /\[(?:PENDIENTE|VALIDAR|FECHA)|CONTENT PENDING/i.test(
              document.body.innerText,
            ),
          minimumBodyFont,
          headshotTextContrast,
          comparisonSeam,
          horizontalOverflow:
            document.documentElement.scrollWidth >
              document.documentElement.clientWidth + 1,
          overflowElements,
          clippedText,
        };
      },
      { routePath: route, originCandidates: origins, contract: expected },
    );

    const origin = audit.expectedOrigin;
    const canonical = origin + route;
    const article = audit.schema.article;
    const articlePass =
      audit.schema.articleCount === 1 && audit.schema.faqCount === 1 &&
      audit.schema.breadcrumbCount === 1 &&
      audit.schema.topLevelServiceCount === 0 && !audit.schema.unsafe &&
      article?.["@id"] === canonical + "#webpage" && article?.url === canonical &&
      article?.name === expected.title && article?.description === expected.description &&
      article?.headline === expected.title &&
      article?.author?.["@id"] === origin + "/#lisa" &&
      article?.publisher?.["@id"] === origin + "/#business" &&
      article?.datePublished === "2026-08-11" &&
      article?.dateModified === "2026-08-11" &&
      article?.image === origin + "/uploads/branding-chef-kitchen-richland-wa.jpg" &&
      article?.primaryImageOfPage?.url ===
        origin + "/uploads/branding-chef-kitchen-richland-wa.jpg" &&
      article?.isPartOf?.["@id"] === origin + "/#website" &&
      article?.mainEntityOfPage?.["@id"] === canonical &&
      article?.inLanguage === "en-US" &&
      JSON.stringify(audit.schema.articleAbout) === JSON.stringify([
        ["Thing", "Branding photography"],
        ["Thing", "Professional headshots"],
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
      { position: 1, name: "Home", item: origin + "/" },
      { position: 2, name: "Journal", item: origin + "/journal/" },
      { position: 3, name: "Branding Photos vs. Headshots", item: canonical },
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
      audit.imageContractMatches && audit.renderedImages.length === 11 &&
      audit.uniqueImageSourceCount === 11 &&
      audit.renderedImages.filter((image) => image.alt).length === 8 &&
      audit.renderedImages.filter((image) => image.decorative).length === 3 &&
      audit.renderedImages.every((image, index) =>
        image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 &&
        image.intrinsicWidth > 0 && image.intrinsicHeight > 0 &&
        image.renderedWidth > 0 && image.renderedHeight > 0 &&
        image.loading === (index < 3 ? "eager" : "lazy") &&
        image.decoding === "async" &&
        ([1, 2, 10].includes(index)
          ? image.decorative && image.ariaHiddenContext
          : !image.decorative) &&
        (index === 0 ? image.fetchpriority === "high" : image.fetchpriority !== "high") &&
        image.responsivePathCount >= 1 && image.allResponsiveWebp &&
        /\.webp$/.test(image.currentPath) &&
        [400, 640, 960, 1440].includes(image.selectedWidth) &&
        (index === 1 || index === 2 ? true : image.sizes.length > 0) &&
        image.ratioDelta < 0.01,
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
        item.outlineContrast >= 3 &&
        item.width >= 44 && item.height >= 44,
      );
    const expectedRobots = audit.publicationMode === "release"
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow, noarchive";
    const checks = {
      response: Boolean(response?.ok()),
      mode: audit.publicationMode === "release" || audit.publicationMode === "staging",
      publication:
        audit.contentStatus === "ready" && audit.signature === "crossing-line" &&
        audit.robots === expectedRobots && audit.canonical === canonical &&
        audit.openGraphType === "article",
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
        JSON.stringify(audit.bylineValues) === JSON.stringify([
          "By Lisa Weiss",
          "It's A Keeper Photography",
          "Richland, WA",
        ]) &&
        audit.bylineTime.label === "August 11, 2026" &&
        audit.bylineTime.datetime === "2026-08-11",
      checklist:
        audit.checklist.length === 5 &&
        JSON.stringify(audit.checklist) === JSON.stringify(expected.checklist),
      table:
        audit.tableSemantics.labelledBy === "side-by-side-title" &&
        JSON.stringify(audit.tableSemantics.headerTexts) ===
          JSON.stringify(["Comparison point", "Headshot", "Branding photos"]) &&
        JSON.stringify(audit.tableSemantics.columnScopes) ===
          JSON.stringify(["col", "col", "col"]) &&
        JSON.stringify(audit.tableSemantics.rowScopes) ===
          JSON.stringify(["row", "row", "row", "row", "row", "row"]) &&
        JSON.stringify(audit.tableSemantics.rows) ===
          JSON.stringify(expected.comparisonRows) &&
        audit.comparisonSeam.visible && audit.comparisonSeam.lineCount === 2 &&
        audit.comparisonSeam.linesVisible &&
        audit.comparisonSeam.direction === (viewport.width <= 767 ? "row" : "column") &&
        (viewport.width <= 767
          ? audit.comparisonSeam.seamHeight > 0
          : audit.comparisonSeam.seamWidth > 0 &&
            audit.comparisonSeam.figureGap >= audit.comparisonSeam.seamWidth),
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
      cssIsolation: audit.stylesheetCount === 1 && audit.directionContract,
      focus: focusPass,
      reducedMotion:
        heroScroll.reducedMotion && heroScroll.scrollBehavior !== "smooth" &&
        audit.reducedMotion.matches && audit.reducedMotion.scrollBehavior !== "smooth",
      copySafety:
        !audit.placeholderLeak && audit.minimumBodyFont >= 16 &&
        audit.headshotTextContrast >= 4.5,
      noOverflow:
        !audit.horizontalOverflow && audit.overflowElements.length === 0 &&
        audit.clippedText.length === 0,
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
        viewport.id + "px (" + audit.publicationMode + "): " +
          viewportFailures.join(", "),
      );
    }

    const artifactRoot =
      ".artifacts/branding-headshots-article/" +
      audit.publicationMode + "-" + viewport.id;
    await page.screenshot({
      path: artifactRoot + "-full.png",
      fullPage: true,
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    await page.locator("#side-by-side").screenshot({
      path: artifactRoot + "-comparison.png",
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    await page.locator("#common-questions").screenshot({
      path: artifactRoot + "-faq.png",
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
        artifactRoot + "-full.png",
        artifactRoot + "-comparison.png",
        artifactRoot + "-faq.png",
      ],
    });

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onRequestFailed);
    page.off("response", onResponse);
  }

  await page.goto(baseUrl + "/journal/in-home-vs-studio-newborn-photography/", {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  const leakedStylesheets = await page.locator(
    'link[rel="stylesheet"][href*="journal-branding-vs-headshots-page"]',
  ).count();
  if (leakedStylesheets !== 0) {
    failures.push("Branding vs. Headshots stylesheet leaked into Newborn Comparison.");
  }

  if (failures.length) {
    throw new Error(
      "Branding vs. Headshots responsive QA failed:\n" + failures.join("\n"),
    );
  }
  return results;
}
