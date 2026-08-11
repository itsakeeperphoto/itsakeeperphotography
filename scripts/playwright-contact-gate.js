async (page) => {
  const currentUrl = page.url();
  const originMatch = currentUrl.match(
    /^(http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?)(?:\/|$)/i,
  );
  if (!originMatch) {
    throw new Error(
      "Contact gate QA is restricted to a local http://127.0.0.1 or localhost preview.",
    );
  }

  const baseUrl = originMatch[1];
  const contactUrl = `${baseUrl}/contact/`;
  const postUrl = `${baseUrl}/`;
  const postGuardPattern = "**/*";
  const analyticsPostPattern =
    /^https:\/\/(?:r\.clarity\.ms|www\.google\.com|(?:www\.|region1\.)?google-analytics\.com)(?:\/|$)/i;
  const viewports = [
    { id: "1440", width: 1440, height: 1000 },
    { id: "1200", width: 1200, height: 900 },
    { id: "900", width: 900, height: 900 },
    { id: "390", width: 390, height: 844 },
  ];
  const failures = [];
  const report = { success: [], failures: [], network: null, noJs: null };

  const ensure = (condition, message) => {
    if (!condition) throw new Error(message);
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
      () => document.querySelector("[data-session-planner]")?.dataset.enhanced === "true",
    );
  };

  const readGateState = () =>
    page.evaluate(() => {
      const planner = document.querySelector("[data-session-planner]");
      const form = document.querySelector("[data-session-estimate-form]");
      const receipt = document.querySelector("[data-estimate-receipt]");
      const details = document.querySelector("[data-estimate-details]");
      const mobileTotal = document.querySelector("[data-mobile-estimate-total]");
      const success = document.querySelector("[data-estimate-success]");
      const error = document.querySelector("[data-estimate-error]");
      const totalLive = document.querySelector("[data-total-live]");
      return {
        plannerState: planner?.getAttribute("data-estimate-state"),
        receiptState: receipt?.getAttribute("data-estimate-state"),
        detailsHidden: details instanceof HTMLElement && details.hidden,
        detailsRendered:
          details instanceof HTMLElement && details.getClientRects().length > 0,
        mobileTotalHidden:
          mobileTotal instanceof HTMLElement && mobileTotal.hidden,
        successHidden: success instanceof HTMLElement && success.hidden,
        errorHidden: error instanceof HTMLElement && error.hidden,
        successRole: success?.getAttribute("role"),
        successLive: success?.getAttribute("aria-live"),
        errorRole: error?.getAttribute("role"),
        errorLive: error?.getAttribute("aria-live"),
        totalLiveText: totalLive?.textContent?.trim() || "",
        formState: form?.getAttribute("data-submission-state"),
        formBusy: form?.getAttribute("aria-busy"),
        path: location.pathname,
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      };
    });

  const chooseQualifiedPlan = async () => {
    await page.evaluate(() => {
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
    });
  };

  const fillLead = async (suffix) => {
    await page.locator('input[name="name"]').fill(`Contact QA ${suffix}`);
    await page
      .locator('input[name="email"]')
      .fill(`qa+contact-${suffix}@example.com`);
    await page.locator('input[name="phone"]').fill("509-555-0199");
    await page
      .locator('input[name="preferred_timing"]')
      .fill("October, flexible");
    await page
      .locator('textarea[name="story"]')
      .fill("A family session to keep & compare across the years.");
  };

  const addPostMock = async (kind, delay = 0) => {
    const submissions = [];
    const unexpectedPosts = [];
    const blockedAnalyticsPosts = [];
    const handler = async (route) => {
      const request = route.request();
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }

      if (request.url() !== postUrl) {
        const blockedPost = {
          url: request.url(),
          body: request.postData() || "",
        };
        if (analyticsPostPattern.test(request.url())) {
          blockedAnalyticsPosts.push(blockedPost);
        } else {
          unexpectedPosts.push(blockedPost);
        }
        await route.abort();
        return;
      }

      submissions.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        body: request.postData() || "",
      });

      if (delay) await page.waitForTimeout(delay);
      if (kind === "network") {
        await route.abort("internetdisconnected");
      } else {
        await route.fulfill({
          status: kind === "success" ? 200 : 500,
          contentType: "text/plain; charset=utf-8",
          body: kind === "success" ? "ok" : "mocked failure",
        });
      }
    };
    await page.route(postGuardPattern, handler);
    return {
      submissions,
      unexpectedPosts,
      blockedAnalyticsPosts,
      remove: () => page.unroute(postGuardPattern, handler),
    };
  };

  const assertInitialAndInvalidState = async (viewport) => {
    const initial = await readGateState();
    ensure(initial.plannerState === "locked", `${viewport.id}px: planner starts unlocked`);
    ensure(initial.receiptState === "locked", `${viewport.id}px: receipt starts unlocked`);
    ensure(initial.detailsHidden && !initial.detailsRendered, `${viewport.id}px: total is accessible before submit`);
    ensure(initial.mobileTotalHidden, `${viewport.id}px: mobile total is visible before submit`);
    ensure(initial.successHidden && initial.errorHidden, `${viewport.id}px: feedback starts exposed`);
    ensure(initial.totalLiveText === "", `${viewport.id}px: locked total is announced`);
    ensure(!initial.overflow, `${viewport.id}px: initial horizontal overflow`);

    if (viewport.id === "1440") {
      await page
        .locator("[data-finish-estimate]")
        .evaluate((button) => button.click());
      await page.waitForFunction(
        () => document.activeElement?.matches('input[name="name"]') === true,
      );
    }

    await chooseQualifiedPlan();
    const afterChoices = await readGateState();
    ensure(
      afterChoices.receiptState === "locked" &&
        afterChoices.detailsHidden &&
        afterChoices.totalLiveText === "",
      `${viewport.id}px: selections revealed or announced the total`,
    );

    let accidentalPosts = 0;
    const guard = async (route) => {
      if (route.request().method() === "POST") {
        if (route.request().url().startsWith(`${baseUrl}/`)) {
          accidentalPosts += 1;
        }
        await route.abort();
      } else {
        await route.continue();
      }
    };
    await page.route(postGuardPattern, guard);
    await page
      .locator("[data-estimate-submit]")
      .evaluate((button) => button.click());
    await page.waitForTimeout(80);
    const invalid = await page.evaluate(() => {
      const name = document.querySelector('input[name="name"]');
      const email = document.querySelector('input[name="email"]');
      return {
        activeName: document.activeElement === name,
        nameInvalid: name?.getAttribute("aria-invalid"),
        emailRequired: email?.matches(":required"),
      };
    });
    await page.unroute(postGuardPattern, guard);
    const afterInvalid = await readGateState();
    ensure(accidentalPosts === 0, `${viewport.id}px: invalid form attempted a POST`);
    ensure(invalid.activeName, `${viewport.id}px: invalid submit did not focus name`);
    ensure(invalid.nameInvalid === "true", `${viewport.id}px: name lacks aria-invalid`);
    ensure(invalid.emailRequired, `${viewport.id}px: email is not required`);
    ensure(afterInvalid.receiptState === "locked", `${viewport.id}px: invalid submit unlocked receipt`);
  };

  for (const viewport of viewports) {
    try {
      await openContact(viewport);
      await assertInitialAndInvalidState(viewport);
      await fillLead(viewport.id);

      const mock = await addPostMock("success", viewport.id === "1440" ? 120 : 0);
      if (viewport.id === "1440") {
        await page.locator("[data-estimate-submit]").evaluate((button) => {
          button.click();
          button.click();
        });
      } else {
        await page
          .locator("[data-estimate-submit]")
          .evaluate((button) => button.click());
      }

      await page.waitForFunction(
        () =>
          document
            .querySelector("[data-estimate-receipt]")
            ?.getAttribute("data-estimate-state") === "unlocked",
      );
      await page.waitForFunction(
        () => document.activeElement?.matches("[data-receipt-title]") === true,
      );

      const success = await readGateState();
      const successDom = await page.evaluate(() => {
        const details = document.querySelector("[data-estimate-details]");
        const mobileTotal = document.querySelector("[data-mobile-estimate-total]");
        const success = document.querySelector("[data-estimate-success]");
        const submit = document.querySelector("[data-estimate-submit]");
        const selectedControls = [
          ...document.querySelectorAll(
            '[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input], [data-contact-field]',
          ),
        ];
        const analyticsEvents = (window.dataLayer || [])
          .map((entry) => Array.from(entry || []))
          .filter((entry) => entry[0] === "event")
          .map((entry) => entry[1]);
        return {
          detailsHidden: details instanceof HTMLElement && details.hidden,
          mobileTotalHidden:
            mobileTotal instanceof HTMLElement && mobileTotal.hidden,
          successHidden: success instanceof HTMLElement && success.hidden,
          successText: success?.textContent?.trim() || "",
          submitDisabled:
            submit instanceof HTMLButtonElement && submit.disabled,
          controlsFrozen: selectedControls.every(
            (control) =>
              (control instanceof HTMLInputElement ||
                control instanceof HTMLSelectElement ||
                control instanceof HTMLTextAreaElement) &&
              control.disabled,
          ),
          analyticsEvents,
          titleFocused:
            document.activeElement?.matches("[data-receipt-title]") === true,
          total: document
            .querySelector("[data-estimate-total]")
            ?.textContent?.trim(),
        };
      });

      ensure(mock.submissions.length === 1, `${viewport.id}px: expected one POST, found ${mock.submissions.length}`);
      const submission = mock.submissions[0];
      const params = await page.evaluate((body) => {
        const search = new URLSearchParams(body);
        return {
          formName: search.get("form-name"),
          sessionType: search.get("session_type"),
          sessionPackage: search.get("session_package"),
          people: search.get("people"),
          collection: search.get("collection"),
          addons: search.getAll("addons"),
          name: search.get("name"),
          email: search.get("email"),
          phone: search.get("phone"),
          story: search.get("story"),
          estimatedTotal: search.get("estimated_total"),
          calculationStatus: search.get("calculation_status"),
          estimateBreakdown: search.get("estimate_breakdown"),
        };
      }, submission.body);
      ensure(
        mock.unexpectedPosts.length === 0,
        `${viewport.id}px: unexpected POST target was attempted: ${JSON.stringify(mock.unexpectedPosts.map((post) => post.url))}`,
      );
      ensure(submission.url === postUrl, `${viewport.id}px: AJAX target is not /`);
      ensure(submission.method === "POST", `${viewport.id}px: request is not POST`);
      ensure(
        submission.headers["content-type"]?.startsWith(
          "application/x-www-form-urlencoded",
        ),
        `${viewport.id}px: request is not URL-encoded`,
      );
      ensure(params.formName === "session-estimate", `${viewport.id}px: form-name missing`);
      ensure(params.sessionType === "family", `${viewport.id}px: raw session missing`);
      ensure(params.sessionPackage === "three", `${viewport.id}px: raw package missing`);
      ensure(params.people === "7", `${viewport.id}px: people missing`);
      ensure(params.collection === "one", `${viewport.id}px: collection missing`);
      ensure(
        JSON.stringify(params.addons) ===
          JSON.stringify(["extraImage", "rush"]),
        `${viewport.id}px: add-ons missing`,
      );
      ensure(params.estimatedTotal === "$955.98", `${viewport.id}px: hidden total is wrong`);
      ensure(params.name === `Contact QA ${viewport.id}`, `${viewport.id}px: lead name missing`);
      ensure(
        params.email === `qa+contact-${viewport.id}@example.com`,
        `${viewport.id}px: lead email missing`,
      );
      ensure(params.phone === "509-555-0199", `${viewport.id}px: lead phone missing`);
      ensure(
        params.story === "A family session to keep & compare across the years.",
        `${viewport.id}px: lead story missing`,
      );
      ensure(
        params.calculationStatus === "Calculated in browser" &&
          params.estimateBreakdown?.includes("Estimated total: $955.98"),
        `${viewport.id}px: hidden estimate breakdown is missing`,
      );
      ensure(
        submission.body.includes("%26") &&
          !submission.body.includes("keep & compare"),
        `${viewport.id}px: reserved characters were not encoded`,
      );
      ensure(success.plannerState === "unlocked", `${viewport.id}px: planner did not unlock`);
      ensure(success.receiptState === "unlocked", `${viewport.id}px: receipt did not unlock`);
      ensure(!successDom.detailsHidden, `${viewport.id}px: receipt details remain hidden`);
      ensure(!successDom.mobileTotalHidden, `${viewport.id}px: mobile total remains hidden`);
      ensure(!successDom.successHidden, `${viewport.id}px: success message remains hidden`);
      ensure(
        successDom.successText.includes("your details were sent to Lisa") &&
          successDom.successText.includes("estimate is now unlocked"),
        `${viewport.id}px: success message is empty or misleading`,
      );
      ensure(success.successRole === "status" && success.successLive === "polite", `${viewport.id}px: success live region changed`);
      ensure(successDom.titleFocused, `${viewport.id}px: focus did not move to receipt title`);
      ensure(successDom.total === "$955.98", `${viewport.id}px: revealed total is wrong`);
      ensure(successDom.submitDisabled && successDom.controlsFrozen, `${viewport.id}px: submitted plan is still editable`);
      ensure(
        JSON.stringify(successDom.analyticsEvents) ===
          JSON.stringify([
            "contact_gate_view",
            "estimate_started",
            "contact_gate_submit_attempt",
            "contact_gate_submit_success",
            "estimate_revealed",
          ]),
        `${viewport.id}px: non-PII gtag funnel events are incomplete or out of order`,
      );
      ensure(success.path === "/contact/", `${viewport.id}px: AJAX success navigated away`);
      ensure(!success.overflow, `${viewport.id}px: success state overflows horizontally`);
      await mock.remove();

      report.success.push({
        viewport: viewport.id,
        requestCount: mock.submissions.length,
        total: successDom.total,
        state: success,
      });
    } catch (error) {
      failures.push(`${viewport.id}px success: ${error.message}`);
      await page.unroute(postGuardPattern).catch(() => undefined);
    }
  }

  const runFailureScenario = async (viewport, kind) => {
    await openContact(viewport);
    await chooseQualifiedPlan();
    await fillLead(`${viewport.id}-${kind}`);
    const before = await page.evaluate(() => ({
      name: document.querySelector('input[name="name"]')?.value,
      email: document.querySelector('input[name="email"]')?.value,
      story: document.querySelector('textarea[name="story"]')?.value,
      session: document.querySelector('input[name="session_type"]:checked')?.value,
      sessionPackage: document.querySelector('input[name="session_package"]:checked')?.value,
      collection: document.querySelector('input[name="collection"]:checked')?.value,
      people: document.querySelector('input[name="people"]')?.value,
    }));
    const mock = await addPostMock(kind);
    await page
      .locator("[data-estimate-submit]")
      .evaluate((button) => button.click());
    await page.locator("[data-estimate-error]").waitFor({ state: "visible" });
    const gate = await readGateState();
    const after = await page.evaluate(() => {
      const error = document.querySelector("[data-estimate-error]");
      const submit = document.querySelector("[data-estimate-submit]");
      return {
        name: document.querySelector('input[name="name"]')?.value,
        email: document.querySelector('input[name="email"]')?.value,
        story: document.querySelector('textarea[name="story"]')?.value,
        session: document.querySelector('input[name="session_type"]:checked')?.value,
        sessionPackage: document.querySelector('input[name="session_package"]:checked')?.value,
        collection: document.querySelector('input[name="collection"]:checked')?.value,
        people: document.querySelector('input[name="people"]')?.value,
        errorFocused: document.activeElement === error,
        errorText: error?.textContent?.trim() || "",
        submitEnabled:
          submit instanceof HTMLButtonElement && !submit.disabled,
        analyticsEvents: (window.dataLayer || [])
          .map((entry) => Array.from(entry || []))
          .filter((entry) => entry[0] === "event")
          .map((entry) => entry[1]),
      };
    });
    ensure(mock.submissions.length === 1, `${kind}: expected exactly one mocked POST`);
    ensure(
      mock.unexpectedPosts.length === 0,
      `${kind}: unexpected POST target was attempted: ${JSON.stringify(mock.unexpectedPosts.map((post) => post.url))}`,
    );
    ensure(JSON.stringify(after, ["name", "email", "story", "session", "sessionPackage", "collection", "people"]) === JSON.stringify(before), `${kind}: form values changed after failure`);
    ensure(gate.plannerState === "locked" && gate.receiptState === "locked", `${kind}: failure unlocked estimate`);
    ensure(gate.detailsHidden && gate.mobileTotalHidden, `${kind}: failure exposed a total`);
    ensure(gate.successHidden && !gate.errorHidden, `${kind}: feedback state is wrong`);
    ensure(gate.errorRole === "alert" && gate.errorLive === "assertive", `${kind}: error live region changed`);
    ensure(after.errorFocused, `${kind}: focus did not move to the error`);
    ensure(
      after.errorText.includes("estimate is still locked") &&
        after.errorText.includes("please try again"),
      `${kind}: error recovery message is empty or misleading`,
    );
    ensure(after.submitEnabled && gate.formBusy === null, `${kind}: retry is unavailable`);
    ensure(
      after.analyticsEvents.includes("contact_gate_submit_error") &&
        !after.analyticsEvents.includes("contact_gate_submit_success") &&
        !after.analyticsEvents.includes("estimate_revealed"),
      `${kind}: gtag reported a false conversion or omitted the error event`,
    );
    ensure(gate.path === "/contact/" && !gate.overflow, `${kind}: navigation or overflow occurred`);
    await mock.remove();
    return { viewport: viewport.id, kind, requestCount: mock.submissions.length, gate };
  };

  try {
    report.failures.push(
      await runFailureScenario(viewports[1], "server"),
    );
  } catch (error) {
    failures.push(`1200px 5xx: ${error.message}`);
    await page.unroute(postGuardPattern).catch(() => undefined);
  }

  try {
    report.network = await runFailureScenario(viewports[3], "network");
  } catch (error) {
    failures.push(`390px network: ${error.message}`);
    await page.unroute(postGuardPattern).catch(() => undefined);
  }

  let noJsContext;
  try {
    const browser = page.context().browser();
    ensure(Boolean(browser), "no-js: browser instance is unavailable");
    noJsContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const noJsPage = await noJsContext.newPage();
    const fallbackPosts = [];
    await noJsPage.route(postGuardPattern, async (route) => {
      const request = route.request();
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }
      fallbackPosts.push({
        url: request.url(),
        method: request.method(),
        body: request.postData() || "",
      });
      await route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        body: "mocked no-JavaScript confirmation",
      });
    });

    const response = await noJsPage.goto(contactUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    ensure(Boolean(response?.ok()), "no-js: Contact did not return 2xx");
    const form = noJsPage.locator("[data-session-estimate-form]");
    ensure((await form.getAttribute("method")) === "post", "no-js: form method changed");
    ensure((await form.getAttribute("action")) === "/thank-you/", "no-js: fallback action changed");
    ensure((await form.getAttribute("data-netlify")) === "true", "no-js: Netlify detection is missing");
    ensure((await form.getAttribute("netlify-honeypot")) === "bot-field", "no-js: honeypot changed");
    ensure(
      await noJsPage.locator("[data-estimate-details]").isHidden(),
      "no-js: personalized estimate starts exposed",
    );
    ensure(
      await noJsPage.locator("noscript .planner-noscript").isVisible(),
      "no-js: fallback explanation is not visible",
    );

    await noJsPage.locator('input[name="name"]').fill("No JS QA");
    await noJsPage.locator('input[name="email"]').fill("no-js@example.com");
    await noJsPage.locator("[data-estimate-submit]").click();
    ensure(fallbackPosts.length === 1, `no-js: expected one fallback POST, found ${fallbackPosts.length}`);
    ensure(
      fallbackPosts[0].url === `${baseUrl}/thank-you/` &&
        fallbackPosts[0].method === "POST",
      "no-js: native fallback did not POST to /thank-you/",
    );
    ensure(
      fallbackPosts[0].body.includes("form-name=session-estimate") &&
        fallbackPosts[0].body.includes("name=No+JS+QA") &&
        fallbackPosts[0].body.includes("email=no-js%40example.com"),
      "no-js: native fallback payload is incomplete",
    );
    report.noJs = {
      viewport: "390",
      requestCount: fallbackPosts.length,
      target: fallbackPosts[0].url,
    };
  } catch (error) {
    failures.push(`390px no-js fallback: ${error.message}`);
  } finally {
    await noJsContext?.close().catch(() => undefined);
  }

  if (failures.length) {
    throw new Error(`Contact estimate gate QA failed:\n${failures.join("\n")}`);
  }

  return report;
}
