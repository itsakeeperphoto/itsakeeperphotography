async (page) => {
  const root = page.url() && page.url() !== "about:blank"
    ? `${page.url().split("/").slice(0, 3).join("/")}/`
    : "http://localhost:4321/";
  const artifacts = ".artifacts/home-session-cards";
  const viewports = [
    { name: "1728", width: 1728, height: 963 },
    { name: "1440", width: 1440, height: 1000 },
    { name: "1200", width: 1200, height: 900 },
    { name: "900", width: 900, height: 900 },
    { name: "390", width: 390, height: 844 },
  ];
  const consoleErrors = [];
  const report = {};
  const expectedHero = {
    src: "/uploads/kennewick-couple-open-field-golden-hour.jpg",
    alt: "A couple laughing together while walking through an open field in warm evening light",
    desktopCurrent: [
      "/uploads/kennewick-couple-open-field-golden-hour-desktop.avif",
      "/uploads/kennewick-couple-open-field-golden-hour-desktop.webp",
    ],
    mobileCurrent: [
      "/uploads/kennewick-couple-open-field-golden-hour-mobile.avif",
      "/uploads/kennewick-couple-open-field-golden-hour-mobile.webp",
    ],
  };
  const expectedBiography = {
    portrait: "/uploads/lisa-photographer-tricities.jpg",
    portraitAlt:
      "Lisa, owner of It’s A Keeper Photography, holding her camera in the Tri-Cities",
    print: "/uploads/about-lisa-camera-candid-black-white.jpg",
  };
  const expectedCards = [
    {
      id: "seniors",
      src: "/uploads/senior-portrait-golden-hour-richland.jpg",
      alt: "High school senior in a black dress photographed at golden hour in Richland",
    },
    {
      id: "families",
      src: "/uploads/about-belief-family-golden-hour-tricities.jpg",
      alt: "Parents holding their young child close in warm evening light",
    },
    {
      id: "newborns",
      src: "/uploads/newborn-family-at-home-west-richland.jpg",
      alt: "Parents and an older sister gathered around a sleeping newborn on a bed",
    },
    {
      id: "branding",
      src: "/uploads/about-lisa-camera-portrait-tricities.jpg",
      alt: "A photographer holding her camera during an outdoor portrait",
    },
    {
      id: "headshots",
      src: "/uploads/review-lisa-griffith-headshot-tricities.jpg",
      alt: "A man in a black shirt seated against a dark studio backdrop",
    },
  ];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push({
        text: message.text(),
        url: message.location()?.url || "",
      });
    }
  });
  page.on("pageerror", (error) =>
    consoleErrors.push({ text: error.message, url: page.url() })
  );

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(root, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => {
      const image = document.querySelector(".hero__image");
      return image?.complete && image.naturalWidth > 0;
    });
    const hero = page.locator("#home");
    await hero.screenshot({
      path: `${artifacts}/hero-${viewport.name}.png`,
    });
    report[viewport.name] = {
      hero: await page.evaluate(
        ({ expectedHero, isMobile }) => {
          const image = document.querySelector(".hero__image");
          const section = document.querySelector("#home");
          const title = document.querySelector(".hero__title");
          const trust = document.querySelector(".hero__trust");
          const imageBox = image.getBoundingClientRect();
          const sectionBox = section.getBoundingClientRect();
          const titleBox = title.getBoundingClientRect();
          const trustBox = trust.getBoundingClientRect();
          const currentPath = new URL(image.currentSrc).pathname;
          const expectedCurrent = isMobile
            ? expectedHero.mobileCurrent
            : expectedHero.desktopCurrent;
          const heroRequests = performance
            .getEntriesByType("resource")
            .map((entry) => new URL(entry.name).pathname)
            .filter((pathname) =>
              pathname.includes("kennewick-couple-open-field-golden-hour"),
            );
          return {
            src: image.getAttribute("src"),
            alt: image.alt,
            loading: image.loading,
            fetchpriority: image.getAttribute("fetchpriority"),
            decoding: image.decoding,
            currentPath,
            approvedCurrent: expectedCurrent.includes(currentPath),
            natural: [image.naturalWidth, image.naturalHeight],
            objectPosition: getComputedStyle(image).objectPosition,
            sectionBox: [sectionBox.width, sectionBox.height],
            imageCoversSection:
              imageBox.left <= sectionBox.left + 1 &&
              imageBox.top <= sectionBox.top + 1 &&
              imageBox.right >= sectionBox.right - 1 &&
              imageBox.bottom >= sectionBox.bottom - 1,
            titleInside:
              titleBox.left >= sectionBox.left &&
              titleBox.right <= sectionBox.right &&
              titleBox.top >= sectionBox.top &&
              titleBox.bottom <= sectionBox.bottom,
            trustInside:
              trustBox.left >= sectionBox.left &&
              trustBox.right <= sectionBox.right &&
              trustBox.top >= sectionBox.top &&
              trustBox.bottom <= sectionBox.bottom,
            heroRequests,
            noJpegRequest: !heroRequests.some((pathname) => pathname.endsWith(".jpg")),
          };
        },
        { expectedHero, isMobile: viewport.width <= 767 },
      ),
    };

    const biography = page.locator("#meet-lisa");
    await biography.scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("#meet-lisa img")].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
    await page.evaluate(() => {
      document.activeElement?.blur();
      document.querySelector(".site-header")?.setAttribute("data-qa-hidden", "true");
      document.querySelector(".skip-link")?.setAttribute("data-qa-hidden", "true");
    });
    await page.addStyleTag({
      content: '[data-qa-hidden="true"] { visibility: hidden !important; }',
    });
    await biography.screenshot({
      path: `${artifacts}/meet-lisa-${viewport.name}.png`,
    });
    await page.evaluate(() => {
      document.querySelectorAll("[data-qa-hidden]").forEach((element) =>
        element.removeAttribute("data-qa-hidden")
      );
    });
    report[viewport.name].biography = await page.evaluate(
      ({ expectedBiography, isMobile }) => {
        const section = document.querySelector("#meet-lisa");
        const portrait = section.querySelector("[data-biography-arch] img");
        const print = section.querySelector("[data-biography-print]");
        const printImage = print.querySelector("img");
        const printBox = print.getBoundingClientRect();
        const sectionBox = section.getBoundingClientRect();
        return {
          portrait: {
            src: portrait.getAttribute("src"),
            alt: portrait.alt,
            currentPath: new URL(portrait.currentSrc).pathname,
          },
          print: {
            src: printImage.getAttribute("src"),
            alt: printImage.alt,
            ariaHidden: print.getAttribute("aria-hidden"),
            currentPath: new URL(printImage.currentSrc).pathname,
            objectPosition: getComputedStyle(printImage).objectPosition,
            transform: getComputedStyle(printImage).transform,
            naturalWidth: printImage.naturalWidth,
          },
          contractValid:
            portrait.getAttribute("src") === expectedBiography.portrait &&
            portrait.alt === expectedBiography.portraitAlt &&
            new URL(portrait.currentSrc).pathname.endsWith("-640.webp") &&
            printImage.getAttribute("src") === expectedBiography.print &&
            printImage.alt === "" &&
            print.getAttribute("aria-hidden") === "true" &&
            new URL(printImage.currentSrc).pathname.endsWith(
              isMobile ? "-400.webp" : "-640.webp",
            ) &&
            getComputedStyle(printImage).objectPosition === "50% 50%" &&
            getComputedStyle(printImage).transform === "none",
          printInsideSection:
            printBox.left >= sectionBox.left &&
            printBox.right <= sectionBox.right &&
            printBox.top >= sectionBox.top &&
            printBox.bottom <= sectionBox.bottom,
        };
      },
      { expectedBiography, isMobile: viewport.width <= 767 },
    );

    await page.waitForFunction(() =>
      [...document.querySelectorAll(".portfolio-card__image img")].every(
        (image) => image.complete && image.naturalWidth > 0
      )
    );

    const section = page.locator(".portfolio");
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      document.activeElement?.blur();
      document.querySelector(".site-header")?.setAttribute("data-qa-hidden", "true");
      document.querySelector(".skip-link")?.setAttribute("data-qa-hidden", "true");
    });
    await page.addStyleTag({
      content: '[data-qa-hidden="true"] { visibility: hidden !important; }',
    });
    await section.screenshot({
      path: `${artifacts}/session-cards-${viewport.name}.png`,
    });
    await page.evaluate(() => {
      document.querySelectorAll("[data-qa-hidden]").forEach((element) =>
        element.removeAttribute("data-qa-hidden")
      );
    });

    report[viewport.name].portfolio = await page.evaluate((expectedCards) => {
      const round = (value) => Number(value.toFixed(2));
      const cards = [...document.querySelectorAll(".portfolio-card")];
      const boxes = cards.map((card) => {
        const cardBox = card.getBoundingClientRect();
        const labelBox = card.querySelector(".portfolio-card__label-wrap").getBoundingClientRect();
        const descriptionBox = card
          .querySelector(".portfolio-card__description")
          ?.getBoundingClientRect();
        return {
          x: round(cardBox.x),
          y: round(cardBox.y),
          width: round(cardBox.width),
          height: round(cardBox.height),
          ratio: round(cardBox.width / cardBox.height),
          labelWidthRatio: round(labelBox.width / cardBox.width),
          labelHeightRatio: round(labelBox.height / cardBox.height),
          labelTopRatio: round((labelBox.top - cardBox.top) / cardBox.height),
          labelRightRatio: round((cardBox.right - labelBox.right) / cardBox.width),
          descriptionVisuallyHidden:
            !descriptionBox || (descriptionBox.width <= 1 && descriptionBox.height <= 1),
        };
      });
      const rows = [...new Set(boxes.map((box) => Math.round(box.y)))];
      const renderedCards = cards.map((card) => {
        const image = card.querySelector(".portfolio-card__image img");
        return {
          id: card.id,
          src: image?.getAttribute("src") || "",
          alt: image?.getAttribute("alt") || "",
          currentSrc: image?.currentSrc || "",
          naturalWidth: image?.naturalWidth || 0,
        };
      });
      return {
        cardCount: boxes.length,
        rowCounts: rows.map((row) => boxes.filter((box) => Math.round(box.y) === row).length),
        boxes,
        noHorizontalOverflow:
          document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        headingVisible: Boolean(document.querySelector("#sessions-title")?.offsetParent),
        headshotMediaPresent: Boolean(document.querySelector(
          '#headshots .portfolio-card__image img'
        )),
        renderedCards,
        approvedImageOrder: renderedCards.every((card, index) =>
          card.id === expectedCards[index]?.id &&
          card.src === expectedCards[index]?.src &&
          card.alt === expectedCards[index]?.alt &&
          card.naturalWidth > 0 &&
          card.currentSrc.endsWith(".webp")
        ),
      };
    }, expectedCards);

    const firstCard = page.locator(".portfolio-card").first();
    const secondCard = page.locator(".portfolio-card").nth(1);
    await firstCard.focus();
    await page.keyboard.press("Tab");
    report[viewport.name].portfolio.keyboardFocus = await secondCard.evaluate((card) => {
      const style = getComputedStyle(card);
      return {
        active: card === document.activeElement,
        focusVisible: card.matches(":focus-visible"),
        outline: `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`,
      };
    });

    const audit = report[viewport.name];
    const expectedObjectPosition =
      viewport.width >= 1051 ? "50% 29%" : viewport.width <= 767 ? "50% 42%" : "50% 58%";
    if (
      audit.hero.src !== expectedHero.src ||
      audit.hero.alt !== expectedHero.alt ||
      audit.hero.loading !== "eager" ||
      audit.hero.fetchpriority !== "high" ||
      audit.hero.decoding !== "sync" ||
      !audit.hero.approvedCurrent ||
      audit.hero.objectPosition !== expectedObjectPosition ||
      !audit.hero.imageCoversSection ||
      !audit.hero.titleInside ||
      !audit.hero.trustInside ||
      !audit.hero.noJpegRequest ||
      !audit.biography.contractValid ||
      !audit.biography.printInsideSection ||
      audit.portfolio.cardCount !== expectedCards.length ||
      !audit.portfolio.noHorizontalOverflow ||
      !audit.portfolio.headingVisible ||
      !audit.portfolio.headshotMediaPresent ||
      !audit.portfolio.approvedImageOrder ||
      audit.portfolio.boxes.some(
        (box) =>
          Math.abs(box.ratio - 0.8) > 0.02 ||
          !box.descriptionVisuallyHidden
      ) ||
      !audit.portfolio.keyboardFocus.active ||
      !audit.portfolio.keyboardFocus.focusVisible
    ) {
      throw new Error(
        `Homepage session-card QA failed at ${viewport.name}: ${JSON.stringify(audit)}`
      );
    }
  }

  report.consoleErrors = consoleErrors;
  report.unexpectedConsoleErrors = consoleErrors.filter(
    (error) => !error.url.includes("clarity.ms"),
  );
  if (report.unexpectedConsoleErrors.length > 0) {
    throw new Error(
      `Homepage console QA failed: ${JSON.stringify(report.unexpectedConsoleErrors)}`,
    );
  }
  return report;
}
