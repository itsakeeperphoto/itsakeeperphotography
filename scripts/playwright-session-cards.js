async (page) => {
  const root = "http://localhost:4321/";
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
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(root, { waitUntil: "domcontentloaded" });
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

    report[viewport.name] = await page.evaluate((expectedCards) => {
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
    report[viewport.name].keyboardFocus = await secondCard.evaluate((card) => {
      const style = getComputedStyle(card);
      return {
        active: card === document.activeElement,
        focusVisible: card.matches(":focus-visible"),
        outline: `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`,
      };
    });

    const audit = report[viewport.name];
    if (
      audit.cardCount !== expectedCards.length ||
      !audit.noHorizontalOverflow ||
      !audit.headingVisible ||
      !audit.headshotMediaPresent ||
      !audit.approvedImageOrder ||
      audit.boxes.some(
        (box) =>
          Math.abs(box.ratio - 0.8) > 0.02 ||
          !box.descriptionVisuallyHidden
      ) ||
      !audit.keyboardFocus.active ||
      !audit.keyboardFocus.focusVisible
    ) {
      throw new Error(
        `Homepage session-card QA failed at ${viewport.name}: ${JSON.stringify(audit)}`
      );
    }
  }

  report.consoleErrors = consoleErrors;
  return report;
}
