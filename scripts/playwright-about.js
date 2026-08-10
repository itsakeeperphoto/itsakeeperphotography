async (page) => {
  const baseUrl = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!baseUrl) throw new Error("Open the local site before running this suite.");

  const route = "/about/";
  const releaseOrigin = "https://www.itsakeeperphotography.com";
  const stagingOrigin = "https://itsakeeperphotography.netlify.app";
  const issuuUrl =
    "https://issuu.com/wpdigitalpublications/docs/tri_final2_augsept_19-july30_issuu";
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const expected = {
    title: "Meet Lisa Weiss | Tri-Cities Photographer for 20 Years",
    description:
      "The story behind It's A Keeper Photography — twenty years of preserving Tri-Cities families' most meaningful moments, and the mom who picked up a camera first.",
    personDescription:
      "Professional senior, family and newborn photographer based in Richland, Washington, with over 20 years behind the camera and 14 years in business serving the Tri-Cities.",
    h1: ["Meet Lisa — The Heart Behind It's A Keeper"],
    h2: [
      "It Started With My Own Children",
      'Why "It\'s A Keeper"',
      "A Camera, a Scam, and a Door That Opened Anyway",
      "What Twenty Years Has Taught Me",
      "What I Believe You Deserve",
      "How I Photograph",
      "Lisa, Off Camera",
      "Experience & Recognition",
      "Let's Tell Your Story",
    ],
    anchors: [
      "#it-started-with-my-own-children",
      "/senior-photographer-tri-cities-wa/",
      "/investment/",
      issuuUrl,
      "/contact/",
    ],
    rootRoutes: [
      "/senior-photographer-tri-cities-wa/",
      "/investment/",
      "/contact/",
    ],
    knowsAbout: [
      "senior portrait photography",
      "family photography",
      "newborn photography",
      "branding photography",
      "professional headshots",
      "natural light photography",
      "golden hour portraiture",
    ],
    sameAs: [
      "https://www.instagram.com/itsakeeperphoto/",
      "https://www.facebook.com/10210306464689688",
    ],
    protectedHeroDom:
      "e28a637235dfa3f87fdb438f017e4c9fe9560d2aacc4627076d8e90ebd6a930d",
    geometry: {
      "1440": {
        hero: [0, 118, 1440, 882],
        heroBackground: [0, 118, 1440, 882],
        heroCopy: [160, 323.84, 1120, 470.31],
        heroLeft: [-77.39, 697.39, 292.09, 409.91],
        heroRight: [1213.13, 699.11, 285.68, 405.93],
      },
      "1200": {
        hero: [0, 118, 1200, 782],
        heroBackground: [0, 118, 1200, 782],
        heroCopy: [160, 202.84, 880, 612.31],
        heroLeft: [-71.83, 663.82, 243.42, 341.59],
        heroRight: [1016.26, 665.26, 238.07, 338.28],
      },
      "900": {
        hero: [0, 104, 900, 688],
        heroBackground: [0, 104, 900, 688],
        heroCopy: [106, 185.64, 688, 524.7],
        heroLeft: [-67.4, 586.06, 183.1, 284.91],
        heroRight: [772.19, 587.08, 178.58, 282.5],
      },
      "390": {
        hero: [0, 92, 390, 867.64],
        heroBackground: [0, 92, 390, 867.64],
        heroCopy: [0, 92, 390, 867.64],
        heroLeft: [-44.51, 855.32, 132.29, 201.38],
        heroRight: [294.14, 856.06, 129.11, 199.62],
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
    await page.locator(".about-page").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    const pageImages = page.locator(".about-page img");
    for (let index = 0; index < await pageImages.count(); index += 1) {
      const image = pageImages.nth(index);
      if (!(await image.evaluate((element) => Boolean(element.closest("[data-editorial-hero]"))))) {
        await image.scrollIntoViewIfNeeded();
      }
      await image.evaluate((element) => element.decode().catch(() => undefined));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);

    const menuToggle = page.locator("[data-menu-toggle], .menu-toggle").first();
    let compactMenu = null;
    if (await menuToggle.isVisible()) {
      await menuToggle.focus();
      await page.keyboard.press("Enter");
      compactMenu = {
        opened: (await menuToggle.getAttribute("aria-expanded")) === "true",
      };
      await page.keyboard.press("Escape");
      compactMenu.closed =
        (await menuToggle.getAttribute("aria-expanded")) === "false";
      compactMenu.focusReturned = await menuToggle.evaluate(
        (node) => document.activeElement === node,
      );
    }

    const focusChecks = [];
    const bodyLinks = page.locator(".about-page a[href]");
    for (let index = 0; index < await bodyLinks.count(); index += 1) {
      const link = bodyLinks.nth(index);
      if (!(await link.isVisible())) continue;
      await link.focus();
      focusChecks.push(
        await link.evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            href: node.getAttribute("href"),
            outlineStyle: style.outlineStyle,
            outlineWidth: Number.parseFloat(style.outlineWidth),
            outlineOffset: Number.parseFloat(style.outlineOffset),
            outlineColor: style.outlineColor,
          };
        }),
      );
    }
    await page.evaluate(async () => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo(0, 0);
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
    });
    await page.waitForFunction(
      () => document.getAnimations().every((animation) => animation.playState !== "running"),
      null,
      { timeout: 2_000 },
    );

    const audit = await page.evaluate(
      async ({ expectedDescription, expectedOriginCandidates, issuuHref }) => {
        const root = document.querySelector(".about-page");
        const hero = root?.querySelector('[data-editorial-hero-page="about"]');
        const normalize = (value = "") =>
          value
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
        const flattenSchemas = (value) => {
          if (!value || typeof value !== "object") return [];
          if (Array.isArray(value)) return value.flatMap(flattenSchemas);
          return [value, ...Object.values(value).flatMap(flattenSchemas)];
        };
        const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((script) => {
            try {
              return JSON.parse(script.textContent || "");
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        const schemaObjects = schemas.flatMap(flattenSchemas);
        const aboutPages = schemas.filter((schema) => schema["@type"] === "AboutPage");
        const people = schemas.filter((schema) => schema["@type"] === "Person");
        const businesses = schemas.filter(
          (schema) => schema["@type"] === "LocalBusiness",
        );
        const personObjects = schemaObjects.filter(
          (schema) => schema["@type"] === "Person",
        );
        const breadcrumbs = schemas.filter(
          (schema) => schema["@type"] === "BreadcrumbList",
        );
        const prohibitedSchemaCounts = Object.fromEntries(
          ["Service", "FAQPage", "Review", "AggregateRating"].map((type) => [
            type,
            schemas.filter((schema) => schema["@type"] === type).length,
          ]),
        );
        const schemaUnsafe = schemaObjects.some(
          (schema) =>
            [
              "Review",
              "AggregateRating",
              "GeoCoordinates",
              "EducationalOccupationalCredential",
            ].includes(schema["@type"]) ||
            Object.keys(schema).some((key) =>
              [
                "award",
                "awards",
                "credential",
                "hascredential",
                "memberof",
                "streetaddress",
                "latitude",
                "longitude",
              ].includes(key.toLowerCase()),
            ),
        );
        const anchors = [...(root?.querySelectorAll("a[href]") || [])].map((anchor) => ({
          href: anchor.getAttribute("href") || "",
          target: anchor.getAttribute("target"),
          rel: (anchor.getAttribute("rel") || "").toLowerCase().split(/\s+/).filter(Boolean),
        }));
        const rootRoutes = anchors
          .map((anchor) => anchor.href)
          .filter((href) => href.startsWith("/") && !href.startsWith("//"));
        const externalAnchors = anchors.filter((anchor) => {
          try {
            return new URL(anchor.href, location.href).origin !== location.origin;
          } catch {
            return false;
          }
        });
        const h2s = [...(root?.querySelectorAll("h2") || [])];
        const bodyNodes = [...(root?.querySelectorAll("p, li") || [])].filter((node) => {
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && style.display !== "none" &&
            style.visibility !== "hidden";
        });
        const images = [...(root?.querySelectorAll("img") || [])].map((image) => {
          const width = Number(image.getAttribute("width"));
          const height = Number(image.getAttribute("height"));
          return {
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt"),
            decorative: Boolean(image.closest('[aria-hidden="true"]')),
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            hasDimensions: width > 0 && height > 0,
            ratioDelta:
              image.naturalWidth && image.naturalHeight && width && height
                ? Math.abs(
                    (image.naturalWidth / image.naturalHeight) / (width / height) - 1,
                  )
                : Infinity,
          };
        });
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
            for (const textRect of range.getClientRects()) {
              if (textRect.left < -1 || textRect.right > innerWidth + 1) {
                clippedText.push(normalize(walker.currentNode.textContent || "").slice(0, 80));
              }
            }
          }
        }
        const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
        const publicationMode = canonical === `${expectedOriginCandidates.release}/about/`
          ? "release"
          : canonical === `${expectedOriginCandidates.staging}/about/`
            ? "staging"
            : "unknown";
        const expectedOrigin = publicationMode === "release"
          ? expectedOriginCandidates.release
          : expectedOriginCandidates.staging;
        const person = people[0] || null;
        const breadcrumbItems = breadcrumbs[0]?.itemListElement || [];
        const issuuAnchors = externalAnchors.filter((anchor) => anchor.href === issuuHref);
        const unsafeText = normalize(root?.textContent || "");
        const firstBodyContentNode = [...document.body.childNodes].find(
          (node) => node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim()),
        );

        return {
          responseMode: publicationMode,
          contentStatus: root?.getAttribute("data-content-status"),
          signature: root?.getAttribute("data-signature-device"),
          title: document.title,
          description:
            document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
          descriptionExpectedInBrowser: expectedDescription,
          canonical,
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          currentPage:
            document.querySelector('.primary-nav__link[aria-current="page"]')
              ?.textContent?.trim() || null,
          directionContract:
            firstBodyContentNode?.nodeType === Node.COMMENT_NODE &&
            firstBodyContentNode.textContent?.includes(
              "THESIS: Lisa's About page is a keeper archive",
            ) &&
            firstBodyContentNode.textContent?.includes(
              "FINISH: unreviewed and undocumented is unfinished",
            ),
          h1: [...(root?.querySelectorAll("h1") || [])].map((node) =>
            normalize(node.textContent || ""),
          ),
          h2: h2s.map((node) => normalize(node.textContent || "")),
          headingsFit: h2s.every((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return [...range.getClientRects()].every(
              (box) => box.left >= -1 && box.right <= innerWidth + 1,
            );
          }),
          anchors,
          rootRoutes,
          externalAnchors,
          issuuAnchorPass:
            externalAnchors.length === 1 && issuuAnchors.length === 1 &&
            issuuAnchors[0].target === "_blank" &&
            issuuAnchors[0].rel.includes("noopener") &&
            !issuuAnchors[0].rel.includes("nofollow"),
          heroHashLink:
            hero?.querySelectorAll('a[href="#it-started-with-my-own-children"]').length === 1 &&
            hero?.querySelectorAll("a[href]").length === 1,
          minimumBodyFont: bodyNodes.length
            ? Math.min(...bodyNodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)))
            : 0,
          placeholderLeak:
            /\[(?:PENDIENTE|PENDING|VALIDAR|FECHA|INSERT|PLACEHOLDER|PRICE|DATE|URL|LINK|NUMBER|CONFIRM|NAME|si se publica)[^\]]*\]|CONTENT PENDING/i.test(
              unsafeText,
            ),
          unsafeClaimLeak:
            /96\s*(?:\+\s*)?five[- ]star|\bgrammy\b|\bhealth\s+(?:challenge|condition|issue|journey|struggle)s?\b|\baward(?:-winning)?\b|\bcertif(?:ied|ication|ications)\b|\b(?:professional\s+)?memberships?\b|\binsur(?:ed|ance)\b/i.test(
              unsafeText,
            ),
          images,
          overflow:
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
          clippedText,
          sectionBounds: [...(root?.querySelectorAll(":scope > section, :scope > header") || [])]
            .map(rect),
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          activeAnimations: document.getAnimations()
            .filter((animation) => animation.playState === "running").length,
          aboutStylesheet:
            [...document.querySelectorAll('link[rel="stylesheet"]')]
              .map((link) => link.getAttribute("href") || "")
              .filter((href) => /(?:^|\/)about-page[^/]*\.css(?:[?#]|$)/i.test(href)),
          protectedHeroDom: await hash(cleanHtml(hero)),
          geometry: {
            hero: rect(hero),
            heroBackground: rect(hero?.querySelector("[data-hero-background]")),
            heroCopy: rect(hero?.querySelector("[data-hero-copy]")),
            heroLeft: rect(hero?.querySelector('[data-hero-print="left"]')),
            heroRight: rect(hero?.querySelector('[data-hero-print="right"]')),
          },
          schema: {
            aboutPageCount: aboutPages.length,
            personCount: people.length,
            breadcrumbCount: breadcrumbs.length,
            prohibitedSchemaCounts,
            unsafe: schemaUnsafe,
            personObjectCount: personObjects.length,
            businessCount: businesses.length,
            businessFounder: businesses[0]?.founder || null,
            uniquePersonIds: [...new Set(personObjects.map((item) => item["@id"]))],
            personObjectsCanonical: personObjects.every(
              (item) => item["@id"] === `${expectedOrigin}/#lisa`,
            ),
            aboutPage: aboutPages[0] || null,
            person,
            breadcrumbItems,
          },
        };
      },
      {
        expectedDescription: expected.description,
        expectedOriginCandidates: { release: releaseOrigin, staging: stagingOrigin },
        issuuHref: issuuUrl,
      },
    );

    const expectedOrigin = audit.responseMode === "release"
      ? releaseOrigin
      : audit.responseMode === "staging"
        ? stagingOrigin
        : "";
    const expectedCanonical = `${expectedOrigin}${route}`;
    const lisaId = `${expectedOrigin}/#lisa`;
    const businessId = `${expectedOrigin}/#business`;
    const aboutPage = audit.schema.aboutPage;
    const person = audit.schema.person;
    const homeAddress = person?.homeLocation?.address;
    const breadcrumbItems = audit.schema.breadcrumbItems;
    const schemaPass =
      audit.schema.aboutPageCount === 1 && audit.schema.personCount === 1 &&
      audit.schema.personObjectCount === 1 && audit.schema.businessCount === 1 &&
      audit.schema.businessFounder?.["@id"] === lisaId &&
      !Object.hasOwn(audit.schema.businessFounder || {}, "@type") &&
      audit.schema.breadcrumbCount === 1 &&
      Object.values(audit.schema.prohibitedSchemaCounts).every((count) => count === 0) &&
      !audit.schema.unsafe &&
      JSON.stringify(audit.schema.uniquePersonIds) === JSON.stringify([lisaId]) &&
      audit.schema.personObjectsCanonical &&
      aboutPage?.["@id"] === `${expectedCanonical}#webpage` &&
      aboutPage?.url === expectedCanonical && aboutPage?.name === expected.title &&
      aboutPage?.description === expected.description &&
      aboutPage?.about?.["@id"] === lisaId && aboutPage?.mainEntity?.["@id"] === lisaId &&
      person?.name === "Lisa Weiss" && person?.jobTitle === "Professional Photographer" &&
      person?.description === expected.personDescription &&
      person?.worksFor?.["@id"] === businessId &&
      person?.homeLocation?.["@type"] === "Place" &&
      person?.homeLocation?.name === "Richland, Washington" &&
      homeAddress?.["@type"] === "PostalAddress" &&
      homeAddress?.addressLocality === "Richland" && homeAddress?.addressRegion === "WA" &&
      homeAddress?.addressCountry === "US" &&
      JSON.stringify(person?.knowsAbout) === JSON.stringify(expected.knowsAbout) &&
      person?.knowsLanguage === "en" &&
      JSON.stringify(person?.sameAs) === JSON.stringify(expected.sameAs) &&
      person?.subjectOf?.["@type"] === "Article" &&
      person?.subjectOf?.name === "Cover feature: Lisa Weiss" &&
      person?.subjectOf?.isPartOf?.["@type"] === "Periodical" &&
      person?.subjectOf?.isPartOf?.name === "Tri-Cities MOM Magazine" &&
      person?.subjectOf?.datePublished === "2019-08" &&
      person?.subjectOf?.url === issuuUrl &&
      breadcrumbItems.length === 2 && breadcrumbItems[0]?.position === 1 &&
      breadcrumbItems[0]?.name === "Home" && breadcrumbItems[0]?.item === `${expectedOrigin}/` &&
      breadcrumbItems[1]?.position === 2 && breadcrumbItems[1]?.name === "About Lisa" &&
      breadcrumbItems[1]?.item === expectedCanonical;
    const geometryBaseline = expected.geometry[viewport.id];
    const geometryClose = (actual, baseline) =>
      actual && baseline &&
      Math.abs(actual.x - baseline[0]) <= 3 &&
      Math.abs(actual.y - baseline[1]) <= 3 &&
      Math.abs(actual.width - baseline[2]) <= 3 &&
      Math.abs(actual.height - baseline[3]) <= 3;
    const protectedGeometryPass = geometryBaseline &&
      geometryClose(audit.geometry.hero, geometryBaseline.hero) &&
      geometryClose(audit.geometry.heroBackground, geometryBaseline.heroBackground) &&
      geometryClose(audit.geometry.heroCopy, geometryBaseline.heroCopy) &&
      geometryClose(audit.geometry.heroLeft, geometryBaseline.heroLeft) &&
      geometryClose(audit.geometry.heroRight, geometryBaseline.heroRight);
    const sectionsWithinViewport = audit.sectionBounds.every(
      (box) => box && box.x >= -1 && box.right <= viewport.width + 1,
    );
    const checks = {
      response: Boolean(response?.ok()),
      mode: audit.responseMode === "release" || audit.responseMode === "staging",
      publication: audit.contentStatus === "ready" && audit.signature === "arch",
      directionContract: Boolean(audit.directionContract),
      metadata:
        audit.title === expected.title && audit.description === expected.description &&
        audit.descriptionExpectedInBrowser === expected.description,
      seo:
        audit.canonical === expectedCanonical &&
        (audit.responseMode === "release"
          ? audit.robots.startsWith("index, follow")
          : audit.robots === "noindex, nofollow, noarchive"),
      schema: schemaPass,
      h1: JSON.stringify(audit.h1) === JSON.stringify(expected.h1),
      h2: JSON.stringify(audit.h2) === JSON.stringify(expected.h2),
      headingsFit: audit.headingsFit,
      links:
        JSON.stringify(audit.anchors.map((anchor) => anchor.href)) ===
          JSON.stringify(expected.anchors) &&
        JSON.stringify(audit.rootRoutes) === JSON.stringify(expected.rootRoutes) &&
        audit.issuuAnchorPass && audit.heroHashLink,
      copySafety:
        !audit.placeholderLeak && !audit.unsafeClaimLeak && audit.minimumBodyFont >= 16,
      cssIsolation: audit.aboutStylesheet.length === 1,
      images:
        audit.images.length > 0 && audit.images.every((image) =>
          image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 &&
          image.hasDimensions && image.ratioDelta < 0.005 && image.alt !== null &&
          (image.decorative || Boolean(image.alt.trim())),
        ),
      focus: focusChecks.every((focus) =>
        focus.outlineStyle !== "none" && focus.outlineWidth >= 2 &&
        focus.outlineOffset >= 3 && focus.outlineColor !== "rgba(0, 0, 0, 0)"),
      compactMenu:
        !compactMenu || (compactMenu.opened && compactMenu.closed && compactMenu.focusReturned),
      reducedMotion: audit.reducedMotion && audit.activeAnimations === 0,
      noOverflow:
        audit.overflow <= 1 && audit.clippedText.length === 0 && sectionsWithinViewport,
      currentPage: audit.currentPage === "About",
      protectedDom: audit.protectedHeroDom === expected.protectedHeroDom,
      protectedGeometry: Boolean(protectedGeometryPass),
      runtime:
        consoleErrors.length === 0 && pageErrors.length === 0 &&
        failedSameOriginRequests.length === 0 && failedSameOriginResponses.length === 0,
    };
    const viewportFailures = Object.entries(checks)
      .filter(([, pass]) => !pass)
      .map(([name]) => name);
    if (viewportFailures.length) {
      failures.push(`${viewport.id}px (${audit.responseMode}): ${viewportFailures.join(", ")}`);
    }

    await page.screenshot({
      fullPage: true,
      path: `.artifacts/about-redesign/final/${audit.responseMode}-${viewport.id}.png`,
      scale: "css",
      type: "png",
      animations: "disabled",
    });
    results.push({
      viewport: viewport.id,
      checks,
      audit,
      compactMenu,
      focusChecks,
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
    throw new Error(`About responsive QA failed:\n${failures.join("\n")}`);
  }
  return results;
}
