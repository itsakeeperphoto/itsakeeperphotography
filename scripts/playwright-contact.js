async (page) => {
  const currentUrl = page.url();
  const originMatch = currentUrl.match(
    /^(http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?)(?:\/|$)/i,
  );
  if (!originMatch) {
    throw new Error(
      "Contact QA is restricted to a local http://127.0.0.1 or localhost preview.",
    );
  }

  const baseUrl = originMatch[1];
  const contactUrl = `${baseUrl}/contact/`;
  const thankYouUrl = `${baseUrl}/thank-you/`;
  const postGuardPattern = "**/*";
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const forbiddenGateSelector = [
    "[data-estimate-state]",
    "[data-submission-state]",
    "[data-estimate-lock]",
    "[data-estimate-details]",
    "[data-estimate-success]",
    "[data-estimate-error]",
    "[data-finish-estimate]",
    "[data-mobile-estimate-lock]",
    "[data-mobile-estimate-label]",
    "[data-receipt-title]",
    "[data-receipt-eyebrow]",
  ].join(", ");
  const failures = [];
  const report = { viewports: [], noJs: null };

  const ensure = (condition, message) => {
    if (!condition) throw new Error(message);
  };

  const parseFormBody = (body) => {
    const entries = body
      .split("&")
      .filter(Boolean)
      .map((pair) => {
        const separator = pair.indexOf("=");
        const rawKey = separator >= 0 ? pair.slice(0, separator) : pair;
        const rawValue = separator >= 0 ? pair.slice(separator + 1) : "";
        return [rawKey, rawValue].map((value) =>
          decodeURIComponent(value.replace(/\+/g, " ")),
        );
      });

    return {
      get: (name) => entries.find(([key]) => key === name)?.[1] ?? null,
      getAll: (name) =>
        entries.filter(([key]) => key === name).map(([, value]) => value),
    };
  };

  const interceptNativePost = async (targetPage) => {
    const submissions = [];
    const unexpectedLocalPosts = [];
    const handler = async (route) => {
      const request = route.request();
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }

      const submission = {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        body: request.postData() || "",
        isNavigation: request.isNavigationRequest(),
        resourceType: request.resourceType(),
      };
      if (request.url() !== thankYouUrl) {
        if (request.url().startsWith(`${baseUrl}/`)) {
          unexpectedLocalPosts.push(submission);
          await route.abort();
        } else {
          await route.continue();
        }
        return;
      }

      submissions.push(submission);
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: "<!doctype html><html><head><title>Contact QA confirmation</title></head><body><main data-mocked-thank-you>Thank you</main></body></html>",
      });
    };

    await targetPage.route(postGuardPattern, handler);
    return {
      submissions,
      unexpectedLocalPosts,
      remove: () => targetPage.unroute(postGuardPattern, handler),
    };
  };

  const openContact = async (viewport) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(contactUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    ensure(Boolean(response?.ok()), `${viewport.id}px: Contact did not return 2xx`);
    await page.locator("[data-session-planner]").waitFor({ state: "visible" });
    await page.waitForFunction(
      () =>
        document.querySelector("[data-session-planner]")?.getAttribute("data-enhanced") ===
        "true",
    );

    if (viewport.width <= 767) {
      await page.locator("[data-session-planner]").scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const mobileBar = document.querySelector("[data-mobile-estimate-bar]");
        return (
          mobileBar instanceof HTMLElement &&
          mobileBar.classList.contains("is-visible") &&
          Number(getComputedStyle(mobileBar).opacity) > 0.99
        );
      });
    }
  };

  const chooseQualifiedPlan = async (targetPage) => {
    await targetPage.evaluate(() => {
      const select = (selector) => {
        const input = document.querySelector(selector);
        if (!(input instanceof HTMLInputElement)) {
          throw new Error(`Missing planner control: ${selector}`);
        }
        input.checked = true;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };

      select('input[name="session_type"][value="family"]');
      select('input[name="session_package"][value="three"]');
      select('input[name="collection"][value="one"]');
      select('input[name="addons"][value="extraImage"]');
      select('input[name="addons"][value="rush"]');

      const people = document.querySelector('input[name="people"]');
      if (!(people instanceof HTMLInputElement)) {
        throw new Error("Missing people control");
      }
      people.value = "7";
      people.dispatchEvent(new Event("input", { bubbles: true }));
      people.dispatchEvent(new Event("change", { bubbles: true }));

      const travel = document.querySelector('input[name="travel_miles"]');
      if (!(travel instanceof HTMLInputElement)) {
        throw new Error("Missing travel control");
      }
      travel.value = "40";
      travel.dispatchEvent(new Event("input", { bubbles: true }));
      travel.dispatchEvent(new Event("change", { bubbles: true }));
    });
  };

  const verifyHeadshotPackage = async (targetPage, viewportId) => {
    await targetPage.evaluate(() => {
      const input = document.querySelector(
        'input[name="session_type"][value="headshots"]',
      );
      if (!(input instanceof HTMLInputElement)) {
        throw new Error("Missing Headshots service control");
      }
      input.checked = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await targetPage.waitForFunction(
      () =>
        document.querySelector("[data-estimate-total]")?.textContent?.trim() ===
          "$175 + tax" &&
        document.querySelector(
          'input[name="session_package"][value="headshot"]',
        )?.checked === true &&
        document.querySelector(
          'input[name="collection"][value="headshotGallery"]',
        )?.checked === true,
    );
    const contract = await targetPage.evaluate(() => ({
      total: document.querySelector("[data-estimate-total]")?.textContent?.trim(),
      headshotPackageVisible:
        document.querySelector('[data-package-row]:has(input[value="headshot"])')
          ?.hidden === false,
      generalPackageHidden:
        document.querySelector('[data-package-row]:has(input[value="one"])')
          ?.hidden === true,
      headshotGalleryVisible:
        document.querySelector(
          '[data-collection-row]:has(input[value="headshotGallery"])',
        )?.hidden === false,
      purchaseNoteVisible:
        document.querySelector("[data-headshot-purchase-note]")?.hidden === false,
    }));
    ensure(
      contract.total === "$175 + tax" &&
        contract.headshotPackageVisible &&
        contract.generalPackageHidden &&
        contract.headshotGalleryVisible &&
        contract.purchaseNoteVisible,
      `${viewportId}px: confirmed Headshot Package contract is not active`,
    );
  };

  const fillRequiredContactFields = async (targetPage, suffix) => {
    await targetPage.locator('input[name="name"]').fill(`Contact QA ${suffix}`);
    await targetPage
      .locator('input[name="email"]')
      .fill(`qa+contact-${suffix}@example.com`);
    await targetPage.locator('input[name="phone"]').fill("509-555-0199");
    await targetPage
      .locator('textarea[name="story"]')
      .fill("A family session to keep & compare across the years.");
  };

  for (const viewport of viewports) {
    let postIntercept;
    try {
      await openContact(viewport);

      const initial = await page.evaluate(
        ({ forbiddenGateSelector, isMobile }) => {
          const planner = document.querySelector("[data-session-planner]");
          const form = document.querySelector("[data-session-estimate-form]");
          const receipt = document.querySelector("[data-estimate-receipt]");
          const desktopTotal = document.querySelector("[data-estimate-total]");
          const mobileBar = document.querySelector("[data-mobile-estimate-bar]");
          const mobileTotal = document.querySelector("[data-mobile-estimate-total]");
          const totalLive = document.querySelector("[data-total-live]");
          const submit = document.querySelector("[data-estimate-submit]");
          const activeTotal = isMobile ? mobileTotal : desktopTotal;
          const activeContainer = isMobile ? mobileBar : receipt;
          const activeContainerStyle =
            activeContainer instanceof HTMLElement
              ? getComputedStyle(activeContainer)
              : null;
          return {
            method: form?.getAttribute("method")?.toLowerCase() || "",
            action: form?.getAttribute("action") || "",
            netlify: form?.getAttribute("data-netlify") || "",
            honeypot: form?.getAttribute("netlify-honeypot") || "",
            desktopTotal: desktopTotal?.textContent?.trim() || "",
            mobileTotal: mobileTotal?.textContent?.trim() || "",
            totalLive: totalLive?.textContent?.trim() || "",
            submitText: submit?.textContent?.trim() || "",
            receiptHidden:
              receipt instanceof HTMLElement &&
              (receipt.hidden || receipt.getAttribute("aria-hidden") === "true"),
            desktopTotalHidden:
              desktopTotal instanceof HTMLElement && desktopTotal.hidden,
            mobileTotalHidden:
              mobileTotal instanceof HTMLElement && mobileTotal.hidden,
            activeTotalRendered:
              activeTotal instanceof HTMLElement && activeTotal.getClientRects().length > 0,
            activeContainerRendered:
              activeContainer instanceof HTMLElement &&
              activeContainer.getClientRects().length > 0 &&
              activeContainerStyle?.display !== "none" &&
              activeContainerStyle?.visibility !== "hidden" &&
              Number(activeContainerStyle?.opacity || "1") > 0,
            gateCount: document.querySelectorAll(forbiddenGateSelector).length,
            enhanced: planner?.getAttribute("data-enhanced"),
            overflow:
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth + 1,
          };
        },
        { forbiddenGateSelector, isMobile: viewport.width <= 767 },
      );
      ensure(initial.method === "post", `${viewport.id}px: form method is not POST`);
      ensure(initial.action === "/thank-you/", `${viewport.id}px: native action changed`);
      ensure(initial.netlify === "true", `${viewport.id}px: Netlify detection is missing`);
      ensure(
        initial.honeypot === "bot-field",
        `${viewport.id}px: Netlify honeypot changed`,
      );
      ensure(
        initial.desktopTotal === "$160" && initial.mobileTotal === "$160",
        `${viewport.id}px: initial SSR totals are not $160`,
      );
      ensure(
        initial.totalLive === "Estimated total $160.",
        `${viewport.id}px: initial total live text is wrong`,
      );
      ensure(
        initial.submitText === "Send My Estimate to Lisa",
        `${viewport.id}px: original submit CTA changed`,
      );
      ensure(
        !initial.receiptHidden &&
          !initial.desktopTotalHidden &&
          !initial.mobileTotalHidden,
        `${viewport.id}px: receipt or total starts hidden`,
      );
      ensure(
        initial.activeContainerRendered && initial.activeTotalRendered,
        `${viewport.id}px: active estimate total is not visible before submit`,
      );
      ensure(initial.gateCount === 0, `${viewport.id}px: gated UI remains in the DOM`);
      ensure(initial.enhanced === "true", `${viewport.id}px: estimator did not initialize`);
      ensure(!initial.overflow, `${viewport.id}px: initial horizontal overflow`);

      postIntercept = await interceptNativePost(page);
      const required = await page.evaluate(() => {
        const form = document.querySelector("[data-session-estimate-form]");
        const fields = Object.fromEntries(
          ["name", "email", "phone", "preferred_timing", "story"].map((name) => {
            const field = form?.querySelector(`[name="${name}"]`);
            return [
              name,
              {
                required:
                  field instanceof HTMLInputElement ||
                  field instanceof HTMLTextAreaElement
                    ? field.required
                    : null,
                valueMissing:
                  field instanceof HTMLInputElement ||
                  field instanceof HTMLTextAreaElement
                    ? field.validity.valueMissing
                    : null,
              },
            ];
          }),
        );
        return {
          fields,
          valid: form instanceof HTMLFormElement ? form.checkValidity() : null,
        };
      });
      ensure(
        ["name", "email", "phone", "story"].every(
          (name) =>
            required.fields[name]?.required === true &&
            required.fields[name]?.valueMissing === true,
        ),
        `${viewport.id}px: required contact validity contract changed`,
      );
      ensure(
        required.fields.preferred_timing?.required === false &&
          required.fields.preferred_timing?.valueMissing === false,
        `${viewport.id}px: preferred timing is not optional`,
      );
      ensure(required.valid === false, `${viewport.id}px: empty form is unexpectedly valid`);

      await page.locator("[data-estimate-submit]").evaluate((button) => button.click());
      await page.waitForTimeout(80);
      const invalid = await page.evaluate(() => ({
        activeName: document.activeElement?.getAttribute("name") === "name",
        nameInvalid:
          document.querySelector('input[name="name"]')?.getAttribute("aria-invalid") ===
          "true",
        path: location.pathname,
      }));
      ensure(
        postIntercept.submissions.length === 0 &&
          postIntercept.unexpectedLocalPosts.length === 0,
        `${viewport.id}px: invalid form attempted a POST`,
      );
      ensure(
        invalid.activeName && invalid.nameInvalid,
        `${viewport.id}px: invalid native submit did not focus and mark name`,
      );
      ensure(invalid.path === "/contact/", `${viewport.id}px: invalid form navigated`);

      await verifyHeadshotPackage(page, viewport.id);

      await chooseQualifiedPlan(page);
      await fillRequiredContactFields(page, viewport.id);
      await page.waitForFunction(
        () =>
          document.querySelector("[data-estimate-total]")?.textContent?.trim() ===
            "$985.98" &&
          document.querySelector("[data-mobile-estimate-total]")?.textContent?.trim() ===
            "$985.98" &&
          document.querySelector('input[name="estimated_total"]')?.value ===
            "$985.98",
      );

      const calculated = await page.evaluate((forbiddenGateSelector) => {
        const form = document.querySelector("[data-session-estimate-form]");
        return {
          valid: form instanceof HTMLFormElement ? form.checkValidity() : false,
          timing: document.querySelector('input[name="preferred_timing"]')?.value,
          totalLive: document.querySelector("[data-total-live]")?.textContent?.trim(),
          hiddenTotal: document.querySelector('input[name="estimated_total"]')?.value,
          breakdown: document.querySelector('input[name="estimate_breakdown"]')?.value,
          gateCount: document.querySelectorAll(forbiddenGateSelector).length,
          overflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1,
        };
      }, forbiddenGateSelector);
      ensure(calculated.valid, `${viewport.id}px: completed form is not valid`);
      ensure(calculated.timing === "", `${viewport.id}px: optional timing was not left empty`);
      ensure(
        calculated.hiddenTotal === "$985.98" &&
          calculated.totalLive === "Estimated total $985.98." &&
          calculated.breakdown?.includes("Travel: 40 miles (15 additional, $30)") &&
          calculated.breakdown?.includes("Estimated total: $985.98"),
        `${viewport.id}px: live or hidden estimate did not reach $985.98`,
      );
      ensure(calculated.gateCount === 0, `${viewport.id}px: gate appeared after changes`);
      ensure(!calculated.overflow, `${viewport.id}px: planner changes caused overflow`);

      await Promise.all([
        page.waitForURL(
          (url) => url.href === thankYouUrl,
          { timeout: 10_000 },
        ),
        page.locator("[data-estimate-submit]").click(),
      ]);
      ensure(
        postIntercept.submissions.length === 1,
        `${viewport.id}px: expected one native POST, found ${postIntercept.submissions.length}`,
      );
      ensure(
        postIntercept.unexpectedLocalPosts.length === 0,
        `${viewport.id}px: unexpected local POST target`,
      );

      const submission = postIntercept.submissions[0];
      const params = parseFormBody(submission.body);
      ensure(submission.url === thankYouUrl, `${viewport.id}px: POST target is not /thank-you/`);
      ensure(submission.method === "POST", `${viewport.id}px: submission is not POST`);
      ensure(
        submission.isNavigation && submission.resourceType === "document",
        `${viewport.id}px: submission was not a native document navigation`,
      );
      ensure(
        submission.headers["content-type"]?.startsWith(
          "application/x-www-form-urlencoded",
        ),
        `${viewport.id}px: native form body is not URL-encoded`,
      );
      ensure(params.get("form-name") === "session-estimate", `${viewport.id}px: form-name missing`);
      ensure(params.get("session_type") === "family", `${viewport.id}px: session type missing`);
      ensure(params.get("session_package") === "three", `${viewport.id}px: package missing`);
      ensure(params.get("people") === "7", `${viewport.id}px: people count missing`);
      ensure(params.get("travel_miles") === "40", `${viewport.id}px: travel miles missing`);
      ensure(
        params.get("billable_travel_miles") === "15" &&
          params.get("travel_fee") === "$30",
        `${viewport.id}px: confirmed travel fee was not submitted`,
      );
      ensure(params.get("collection") === "one", `${viewport.id}px: collection missing`);
      ensure(
        JSON.stringify(params.getAll("addons")) ===
          JSON.stringify(["extraImage", "rush"]),
        `${viewport.id}px: add-ons missing`,
      );
      ensure(params.get("name") === `Contact QA ${viewport.id}`, `${viewport.id}px: name missing`);
      ensure(
        params.get("email") === `qa+contact-${viewport.id}@example.com`,
        `${viewport.id}px: email missing`,
      );
      ensure(params.get("phone") === "509-555-0199", `${viewport.id}px: phone missing`);
      ensure(params.get("preferred_timing") === "", `${viewport.id}px: timing payload changed`);
      ensure(
        params.get("story") ===
          "A family session to keep & compare across the years.",
        `${viewport.id}px: story missing`,
      );
      ensure(
        params.get("estimated_total") === "$985.98" &&
          params.get("calculation_status") === "Calculated in browser" &&
          params.get("estimate_breakdown")?.includes("Estimated total: $985.98"),
        `${viewport.id}px: submitted hidden estimate is incomplete`,
      );
      ensure(
        submission.body.includes("%26") &&
          !submission.body.includes("keep & compare"),
        `${viewport.id}px: reserved characters were not encoded`,
      );
      ensure(
        await page.locator("[data-mocked-thank-you]").isVisible(),
        `${viewport.id}px: native navigation did not reach confirmation`,
      );

      report.viewports.push({
        viewport: viewport.id,
        total: params.get("estimated_total"),
        target: submission.url.slice(baseUrl.length),
        nativeNavigation: submission.isNavigation,
      });
    } catch (error) {
      failures.push(`${viewport.id}px: ${error.message}`);
    } finally {
      await postIntercept?.remove().catch(() => undefined);
    }
  }

  let noJsContext;
  let noJsIntercept;
  try {
    const browser = page.context().browser();
    ensure(Boolean(browser), "no-js: browser instance is unavailable");
    noJsContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const noJsPage = await noJsContext.newPage();
    const response = await noJsPage.goto(contactUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    ensure(Boolean(response?.ok()), "no-js: Contact did not return 2xx");

    const noJsForm = noJsPage.locator("[data-session-estimate-form]");
    ensure((await noJsForm.getAttribute("method")) === "post", "no-js: method changed");
    ensure(
      (await noJsForm.getAttribute("action")) === "/thank-you/",
      "no-js: native action changed",
    );
    ensure(
      (await noJsForm.getAttribute("data-netlify")) === "true",
      "no-js: Netlify detection is missing",
    );
    ensure(
      (await noJsForm.getAttribute("netlify-honeypot")) === "bot-field",
      "no-js: honeypot changed",
    );
    ensure(
      (await noJsPage.locator(forbiddenGateSelector).count()) === 0,
      "no-js: gated UI remains",
    );
    ensure(
      (await noJsPage.locator("[data-session-planner]").getAttribute("data-enhanced")) ===
        null,
      "no-js: estimator unexpectedly enhanced",
    );
    ensure(
      (await noJsPage.locator("[data-estimate-total]").textContent())?.trim() ===
        "$160" &&
        (await noJsPage.locator("[data-mobile-estimate-total]").textContent())?.trim() ===
          "$160",
      "no-js: SSR totals are not $160",
    );
    ensure(
      (await noJsPage
        .locator("[data-estimate-total][hidden], [data-mobile-estimate-total][hidden]")
        .count()) === 0,
      "no-js: an SSR total is hidden",
    );
    await noJsPage.locator("[data-estimate-receipt]").scrollIntoViewIfNeeded();
    ensure(
      await noJsPage.locator("[data-estimate-receipt]").isVisible(),
      "no-js: visible receipt is unavailable on mobile",
    );
    ensure(
      await noJsPage.locator("noscript .planner-noscript").isVisible(),
      "no-js: fallback explanation is not visible",
    );

    await fillRequiredContactFields(noJsPage, "no-js");
    ensure(
      (await noJsPage.locator('input[name="preferred_timing"]').inputValue()) ===
        "",
      "no-js: optional timing was not left empty",
    );

    noJsIntercept = await interceptNativePost(noJsPage);
    await Promise.all([
      noJsPage.waitForURL((url) => url.href === thankYouUrl, {
        timeout: 10_000,
      }),
      noJsPage.locator("[data-estimate-submit]").click(),
    ]);
    ensure(
      noJsIntercept.submissions.length === 1 &&
        noJsIntercept.unexpectedLocalPosts.length === 0,
      "no-js: native fallback did not make exactly one POST to /thank-you/",
    );
    const noJsSubmission = noJsIntercept.submissions[0];
    const noJsParams = parseFormBody(noJsSubmission.body);
    ensure(
      noJsSubmission.isNavigation && noJsSubmission.resourceType === "document",
      "no-js: fallback POST was not a document navigation",
    );
    ensure(
      noJsParams.get("form-name") === "session-estimate" &&
        noJsParams.get("session_type") === "senior" &&
        noJsParams.get("session_package") === "one" &&
        noJsParams.get("collection") === "none" &&
        noJsParams.get("people") === "1" &&
        noJsParams.get("name") === "Contact QA no-js" &&
        noJsParams.get("email") === "qa+contact-no-js@example.com" &&
        noJsParams.get("phone") === "509-555-0199" &&
        noJsParams.get("story") ===
          "A family session to keep & compare across the years.",
      "no-js: raw fallback payload is incomplete",
    );
    ensure(
      noJsParams.get("estimated_total") === "" &&
        noJsParams.get("calculation_status") === "Requires manual calculation",
      "no-js: fallback must identify that its total needs manual calculation",
    );
    report.noJs = {
      viewport: "390",
      target: noJsSubmission.url.slice(baseUrl.length),
      nativeNavigation: noJsSubmission.isNavigation,
      initialTotal: "$160",
    };
  } catch (error) {
    failures.push(`390px no-js: ${error.message}`);
  } finally {
    await noJsIntercept?.remove().catch(() => undefined);
    await noJsContext?.close().catch(() => undefined);
  }

  if (failures.length) {
    throw new Error(`Contact estimate QA failed:\n${failures.join("\n")}`);
  }

  return report;
}
