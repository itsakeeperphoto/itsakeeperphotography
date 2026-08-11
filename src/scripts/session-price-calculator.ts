import {
  MAX_PEOPLE,
  MIN_PEOPLE,
  PEOPLE_INCLUDED,
  PHOTO_COLLECTIONS,
  SESSION_ADD_ONS,
  SESSION_PACKAGES,
  SESSION_SERVICES,
  calculateEstimate,
  formatUsd,
  type PhotoCollectionId,
  type SessionAddOnId,
  type SessionPackageId,
  type SessionServiceId,
} from "../lib/session-pricing";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SUBMISSION_TIMEOUT_MS = 15_000;
const ESTIMATE_CONTROL_SELECTOR = [
  "[data-service-radio]",
  "[data-package-radio]",
  "[data-collection-radio]",
  "[data-addon-checkbox]",
  "[data-people-input]",
  "[data-contact-field]",
].join(", ");

const ANALYTICS_EVENT_NAMES = {
  view: "contact_gate_view",
  started: "estimate_started",
  "submit-attempt": "contact_gate_submit_attempt",
  "submit-success": "contact_gate_submit_success",
  "submit-error": "contact_gate_submit_error",
  revealed: "estimate_revealed",
} as const;

type PlannerEventName = keyof typeof ANALYTICS_EVENT_NAMES;
type AnalyticsWindow = Window & {
  gtag?: (
    command: "event",
    eventName: (typeof ANALYTICS_EVENT_NAMES)[PlannerEventName],
  ) => void;
};

type ValidatableControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const query = <ElementType extends Element>(
  root: ParentNode,
  selector: string,
): ElementType | null => root.querySelector<ElementType>(selector);

const setText = (
  root: ParentNode,
  selector: string,
  value: string,
): void => {
  const element = query<HTMLElement>(root, selector);
  if (element) element.textContent = value;
};

const setEstimateField = (
  root: ParentNode,
  name: string,
  value: string,
): void => {
  const field = query<HTMLInputElement>(
    root,
    `[data-estimate-field="${name}"]`,
  );
  if (field) field.value = value;
};

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

const scrollToElement = (element: Element): void => {
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "instant" : "smooth",
    block: "start",
  });
};

const animateTotal = (element: HTMLElement | null): void => {
  if (
    !element ||
    prefersReducedMotion() ||
    typeof element.animate !== "function"
  ) {
    return;
  }

  element.animate(
    [
      { opacity: 0.55, transform: "translateY(0.2rem)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 180,
      easing: "ease-out",
    },
  );
};

const normalizePeople = (input: HTMLInputElement): number => {
  const parsedValue = Number(input.value);
  const wholeValue = Number.isFinite(parsedValue)
    ? Math.trunc(parsedValue)
    : MIN_PEOPLE;
  const people = Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, wholeValue));

  input.value = String(people);
  return people;
};

const isValidatableControl = (
  element: Element,
): element is ValidatableControl =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLSelectElement ||
  element instanceof HTMLTextAreaElement;

const encodeFormData = (formData: FormData): string => {
  const parameters = new URLSearchParams();

  formData.forEach((value, key) => {
    if (typeof value === "string") parameters.append(key, value);
  });

  return parameters.toString();
};

const initializePlanner = (planner: HTMLElement): void => {
  if (planner.hasAttribute("data-enhanced")) return;

  const form = query<HTMLFormElement>(
    planner,
    "[data-session-estimate-form]",
  );
  const peopleInput = query<HTMLInputElement>(planner, "[data-people-input]");
  const decreaseButton = query<HTMLButtonElement>(
    planner,
    "[data-people-decrease]",
  );
  const increaseButton = query<HTMLButtonElement>(
    planner,
    "[data-people-increase]",
  );
  const receipt = query<HTMLElement>(planner, "[data-estimate-receipt]");
  const receiptImage = query<HTMLImageElement>(
    planner,
    "[data-receipt-image]",
  );
  const receiptTotal = query<HTMLElement>(planner, "[data-estimate-total]");
  const mobileTotal = query<HTMLElement>(
    planner,
    "[data-mobile-estimate-total]",
  );
  const mobileBar = query<HTMLElement>(
    planner,
    "[data-mobile-estimate-bar]",
  );
  const mobileEstimateLabel = query<HTMLElement>(
    planner,
    "[data-mobile-estimate-label]",
  );
  const mobileEstimateLock = query<HTMLElement>(
    planner,
    "[data-mobile-estimate-lock]",
  );
  const reviewEstimateButton = query<HTMLButtonElement>(
    planner,
    "[data-review-estimate]",
  );
  const finishEstimateButton = query<HTMLButtonElement>(
    planner,
    "[data-finish-estimate]",
  );
  const receiptLock = query<HTMLElement>(planner, "[data-estimate-lock]");
  const receiptDetails = query<HTMLElement>(
    planner,
    "[data-estimate-details]",
  );
  const receiptTitle = query<HTMLElement>(planner, "[data-receipt-title]");
  const receiptEyebrow = query<HTMLElement>(
    planner,
    "[data-receipt-eyebrow]",
  );
  const submitButton = query<HTMLButtonElement>(
    form || planner,
    "[data-estimate-submit]",
  );
  const successMessage = query<HTMLElement>(
    planner,
    "[data-estimate-success]",
  );
  const errorMessage = query<HTMLElement>(
    planner,
    "[data-estimate-error]",
  );
  const progressButtons = Array.from(
    planner.querySelectorAll<HTMLButtonElement>("[data-planner-progress]"),
  );
  const phases = Array.from(
    planner.querySelectorAll<HTMLElement>("[data-planner-phase]"),
  );

  if (!form || !peopleInput) return;

  let estimateRevealed = false;
  let isSubmitting = false;
  let hasSubmitted = false;
  let hasStarted = false;
  const submitIdleText =
    submitButton?.textContent?.trim() || "Send My Details & Reveal My Estimate";
  const controlsToFreeze = Array.from(
    form.querySelectorAll<ValidatableControl>(ESTIMATE_CONTROL_SELECTOR),
  );
  let priorDisabledStates = new Map<ValidatableControl, boolean>();

  const emitPlannerEvent = (name: PlannerEventName): void => {
    planner.dispatchEvent(
      new CustomEvent(`session-estimate:${name}`, { bubbles: true }),
    );
    (window as AnalyticsWindow).gtag?.(
      "event",
      ANALYTICS_EVENT_NAMES[name],
    );
  };

  const markPlannerStarted = (target: EventTarget | null): void => {
    if (
      hasStarted ||
      !(target instanceof Element) ||
      !target.matches(ESTIMATE_CONTROL_SELECTOR)
    ) {
      return;
    }

    hasStarted = true;
    emitPlannerEvent("started");
  };

  const setSubmissionControlsFrozen = (frozen: boolean): void => {
    if (frozen) {
      priorDisabledStates = new Map(
        controlsToFreeze.map((control) => [control, control.disabled]),
      );
      controlsToFreeze.forEach((control) => {
        control.disabled = true;
      });
      if (decreaseButton) decreaseButton.disabled = true;
      if (increaseButton) increaseButton.disabled = true;
      return;
    }

    controlsToFreeze.forEach((control) => {
      control.disabled = priorDisabledStates.get(control) ?? false;
    });
    priorDisabledStates.clear();
  };

  const setActivePhase = (phaseName: string): void => {
    progressButtons.forEach((button) => {
      if (button.dataset.plannerProgress === phaseName) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  };

  let pendingAdvanceFrame: number | null = null;
  const scheduleSelectionAdvance = (control: HTMLInputElement): void => {
    const targetId = control.dataset.nextTarget;
    if (!targetId || !control.checked) return;

    if (pendingAdvanceFrame !== null) {
      window.cancelAnimationFrame(pendingAdvanceFrame);
    }

    pendingAdvanceFrame = window.requestAnimationFrame(() => {
      pendingAdvanceFrame = null;
      const target = document.getElementById(targetId);
      if (!target || !planner.contains(target)) return;

      const targetPhase = target.closest<HTMLElement>("[data-planner-phase]");
      const phaseName = targetPhase?.dataset.plannerPhase;
      if (phaseName) setActivePhase(phaseName);

      scrollToElement(target);
    });
  };

  const handleSelectionAdvance = (event: Event): void => {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.matches('input[type="radio"][data-next-target]')
    ) {
      scheduleSelectionAdvance(event.target);
    }
  };

  const updateEstimate = (): void => {
    const serviceRadio = query<HTMLInputElement>(
      form,
      "[data-service-radio]:checked",
    );
    const packageRadio = query<HTMLInputElement>(
      form,
      "[data-package-radio]:checked",
    );
    const collectionRadio = query<HTMLInputElement>(
      form,
      "[data-collection-radio]:checked",
    );

    if (!serviceRadio || !packageRadio || !collectionRadio) return;

    const serviceId = serviceRadio.value as SessionServiceId;
    const packageId = packageRadio.value as SessionPackageId;
    const collectionId = collectionRadio.value as PhotoCollectionId;
    const people = normalizePeople(peopleInput);
    const addOns: Partial<Record<SessionAddOnId, boolean>> = {};

    form
      .querySelectorAll<HTMLInputElement>("[data-addon-checkbox]:checked")
      .forEach((checkbox) => {
        addOns[checkbox.value as SessionAddOnId] = true;
      });

    let estimate;
    try {
      estimate = calculateEstimate({
        serviceId,
        packageId,
        collectionId,
        people,
        addOns,
      });
    } catch (error) {
      console.error("The session estimate could not be updated.", error);
      return;
    }

    const service = SESSION_SERVICES[serviceId];
    const selectedPackage = SESSION_PACKAGES[packageId];
    const collection = PHOTO_COLLECTIONS[collectionId];
    const selectedAddOns = Object.keys(addOns)
      .filter((addOnId) => addOns[addOnId as SessionAddOnId])
      .map((addOnId) => SESSION_ADD_ONS[addOnId as SessionAddOnId]);
    const serviceName = serviceRadio.dataset.serviceName || service.name;
    const serviceImage = serviceRadio.dataset.serviceImage || service.image;
    const formattedPackagePrice = formatUsd(estimate.breakdown.packageCents);
    const formattedCollectionPrice = formatUsd(
      estimate.breakdown.collectionCents,
    );
    const formattedExtraPeopleFee = formatUsd(
      estimate.breakdown.extraPeopleCents,
    );
    const formattedAddOnTotal = formatUsd(estimate.breakdown.addOnsCents);
    const formattedTotal = formatUsd(estimate.totalCents);
    const addOnNames = selectedAddOns.map((addOn) => addOn.name);
    const addOnLabel = addOnNames.length > 0 ? addOnNames.join(", ") : "None";
    const peopleLabel =
      estimate.breakdown.extraPeopleCount > 0
        ? `${people} · ${estimate.breakdown.extraPeopleCount} extra · ${formattedExtraPeopleFee}`
        : `${people} · Included`;
    const collectionLabel =
      collection.id === "none"
        ? "No collection yet"
        : `Collection ${collection.name} · ${formattedCollectionPrice}`;
    const addOnReceiptLabel =
      selectedAddOns.length > 0
        ? `${addOnLabel} · ${formattedAddOnTotal}`
        : "None";

    setText(planner, "[data-receipt-service]", serviceName);
    setText(
      planner,
      "[data-receipt-package]",
      `${selectedPackage.name} · ${formattedPackagePrice}`,
    );
    setText(planner, "[data-receipt-people]", peopleLabel);
    setText(planner, "[data-receipt-collection]", collectionLabel);
    setText(planner, "[data-receipt-addons]", addOnReceiptLabel);

    if (receiptImage) {
      receiptImage.src = serviceImage;
      receiptImage.alt = `${serviceName} photography session preview`;
    }

    const totalChanged =
      receiptTotal?.textContent?.trim() !== formattedTotal ||
      mobileTotal?.textContent?.trim() !== formattedTotal;
    if (receiptTotal) receiptTotal.textContent = formattedTotal;
    if (mobileTotal) mobileTotal.textContent = formattedTotal;
    if (totalChanged && estimateRevealed) {
      setText(
        planner,
        "[data-total-live]",
        `Estimated total ${formattedTotal}.`,
      );
      animateTotal(receiptTotal);
      animateTotal(mobileTotal);
    }

    if (estimate.breakdown.extraPeopleCount > 0) {
      const personWord =
        estimate.breakdown.extraPeopleCount === 1 ? "person" : "people";
      setText(
        planner,
        "[data-people-status]",
        `${estimate.breakdown.extraPeopleCount} additional ${personWord} add ${formattedExtraPeopleFee}.`,
      );
    } else {
      setText(
        planner,
        "[data-people-status]",
        `Up to ${PEOPLE_INCLUDED} people are included.`,
      );
    }

    if (decreaseButton) decreaseButton.disabled = people <= MIN_PEOPLE;
    if (increaseButton) increaseButton.disabled = people >= MAX_PEOPLE;

    setEstimateField(planner, "package_name", selectedPackage.name);
    setEstimateField(planner, "package_price", formattedPackagePrice);
    setEstimateField(planner, "extra_people_fee", formattedExtraPeopleFee);
    setEstimateField(planner, "collection_name", collection.name);
    setEstimateField(planner, "collection_price", formattedCollectionPrice);
    setEstimateField(planner, "selected_addons", addOnLabel);
    setEstimateField(planner, "addon_total", formattedAddOnTotal);
    setEstimateField(planner, "estimated_total", formattedTotal);
    setEstimateField(planner, "calculation_status", "Calculated in browser");
    setEstimateField(
      planner,
      "estimate_breakdown",
      [
        `Session: ${serviceName}`,
        `Package: ${selectedPackage.name} (${formattedPackagePrice})`,
        `People: ${people} (${estimate.breakdown.extraPeopleCount} additional, ${formattedExtraPeopleFee})`,
        `Collection: ${collection.name} (${formattedCollectionPrice})`,
        `Add-ons: ${addOnLabel} (${formattedAddOnTotal})`,
        `Estimated total: ${formattedTotal}`,
      ].join("; "),
    );
  };

  const revealEstimate = (): void => {
    estimateRevealed = true;
    hasSubmitted = true;
    planner.dataset.estimateState = "unlocked";
    form.dataset.submissionState = "success";

    if (receipt) receipt.dataset.estimateState = "unlocked";
    if (receiptLock) receiptLock.hidden = true;
    if (receiptDetails) receiptDetails.hidden = false;
    if (receiptEyebrow) {
      receiptEyebrow.textContent = "Personalized session receipt";
    }
    if (receiptTitle) receiptTitle.textContent = "Your Estimate";
    if (mobileEstimateLabel) mobileEstimateLabel.textContent = "Estimated total";
    if (mobileEstimateLock) mobileEstimateLock.hidden = true;
    if (mobileTotal) mobileTotal.hidden = false;
    if (reviewEstimateButton) {
      reviewEstimateButton.textContent = "Review estimate";
    }

    const total = receiptTotal?.textContent?.trim();
    if (total) {
      setText(
        planner,
        "[data-total-live]",
        `Your estimate was revealed. Estimated total ${total}.`,
      );
    }

    if (successMessage) {
      successMessage.textContent =
        "Thank you — your details were sent to Lisa. Your planning estimate is now unlocked, and Lisa will reply personally about your session.";
      successMessage.hidden = false;
    }
    if (errorMessage) errorMessage.hidden = true;

    animateTotal(receiptTotal);
    animateTotal(mobileTotal);
    emitPlannerEvent("submit-success");
    emitPlannerEvent("revealed");

    if (receipt) scrollToElement(receipt);
    window.requestAnimationFrame(() => {
      receiptTitle?.focus({ preventScroll: true });
    });
  };

  const clearInvalidState = (target: EventTarget | null): void => {
    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement) &&
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    target.removeAttribute("aria-invalid");

    if (target instanceof HTMLInputElement && target.type === "radio") {
      Array.from(form.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
        .filter((radio) => radio.name === target.name)
        .forEach((radio) => radio.removeAttribute("aria-invalid"));
    }
  };

  form.addEventListener("input", (event) => {
    clearInvalidState(event.target);
    markPlannerStarted(event.target);
    if (
      event.target instanceof Element &&
      event.target.matches(
        "[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input]",
      )
    ) {
      updateEstimate();
    }
  });
  form.addEventListener("change", (event) => {
    clearInvalidState(event.target);
    markPlannerStarted(event.target);
    if (
      event.target instanceof Element &&
      event.target.matches(
        "[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input]",
      )
    ) {
      updateEstimate();
    }
  });

  // Click also covers a preselected radio, which does not dispatch `change`.
  // The animation frame deduplicates the normal click + change event pair.
  form.addEventListener("click", handleSelectionAdvance);
  form.addEventListener("change", handleSelectionAdvance);

  decreaseButton?.addEventListener("click", () => {
    const people = normalizePeople(peopleInput);
    peopleInput.value = String(Math.max(MIN_PEOPLE, people - 1));
    peopleInput.removeAttribute("aria-invalid");
    updateEstimate();
  });

  increaseButton?.addEventListener("click", () => {
    const people = normalizePeople(peopleInput);
    peopleInput.value = String(Math.min(MAX_PEOPLE, people + 1));
    peopleInput.removeAttribute("aria-invalid");
    updateEstimate();
  });

  progressButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.scrollTarget;
      const target = phases.find((phase) => phase.id === targetId);
      const phaseName = button.dataset.plannerProgress;

      if (phaseName) setActivePhase(phaseName);
      if (target) scrollToElement(target);
    });
  });

  const reviewOrFinishEstimate = (): void => {
    if (estimateRevealed) {
      if (receipt) scrollToElement(receipt);
      return;
    }

    const detailsPhase = phases.find((phase) => phase.id === "planner-details");
    const nameField = query<HTMLInputElement>(form, 'input[name="name"]');
    setActivePhase("details");
    if (detailsPhase) scrollToElement(detailsPhase);
    window.requestAnimationFrame(() => {
      nameField?.focus({ preventScroll: true });
    });
  };

  reviewEstimateButton?.addEventListener("click", reviewOrFinishEstimate);
  finishEstimateButton?.addEventListener("click", reviewOrFinishEstimate);

  if (typeof window.IntersectionObserver === "function") {
    const phaseObserver = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              right.intersectionRatio - left.intersectionRatio ||
              Math.abs(left.boundingClientRect.top) -
                Math.abs(right.boundingClientRect.top),
          );
        const phaseName = (
          entering[0]?.target as HTMLElement | undefined
        )?.dataset.plannerPhase;

        if (phaseName) setActivePhase(phaseName);
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      },
    );

    phases.forEach((phase) => phaseObserver.observe(phase));

    if (mobileBar) {
      const plannerObserver = new IntersectionObserver(
        ([entry]) => {
          mobileBar.classList.toggle("is-visible", Boolean(entry?.isIntersecting));
        },
        { threshold: 0 },
      );
      plannerObserver.observe(planner);
    }
  } else {
    let scheduled = false;
    const updateActivePhaseFromViewport = (): void => {
      scheduled = false;
      const marker = window.innerHeight * 0.25;
      const activePhase =
        phases.find((phase) => {
          const bounds = phase.getBoundingClientRect();
          return bounds.top <= marker && bounds.bottom > marker;
        }) ||
        [...phases].reverse().find((phase) => {
          return phase.getBoundingClientRect().top <= marker;
        }) ||
        phases[0];

      if (activePhase?.dataset.plannerPhase) {
        setActivePhase(activePhase.dataset.plannerPhase);
      }
    };
    const scheduleProgressUpdate = (): void => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateActivePhaseFromViewport);
    };

    window.addEventListener("scroll", scheduleProgressUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleProgressUpdate);
    scheduleProgressUpdate();
    mobileBar?.classList.add("is-visible");
  }

  form.addEventListener(
    "invalid",
    (event) => {
      if (event.target instanceof Element && isValidatableControl(event.target)) {
        event.target.setAttribute("aria-invalid", "true");
      }
    },
    true,
  );

  const clearResolvedInvalidState = (event: Event): void => {
    if (
      event.target instanceof Element &&
      isValidatableControl(event.target) &&
      event.target.checkValidity()
    ) {
      event.target.removeAttribute("aria-invalid");
    }
  };

  form.addEventListener("input", clearResolvedInvalidState);
  form.addEventListener("change", clearResolvedInvalidState);

  form.addEventListener("submit", async (event) => {
    if (isSubmitting || hasSubmitted) {
      event.preventDefault();
      return;
    }

    if (!form.checkValidity()) return;

    event.preventDefault();
    updateEstimate();

    const formData = new FormData(form);
    const encodedBody = encodeFormData(formData);

    isSubmitting = true;
    form.dataset.submissionState = "submitting";
    form.setAttribute("aria-busy", "true");
    if (errorMessage) errorMessage.hidden = true;
    if (successMessage) successMessage.hidden = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }
    setSubmissionControlsFrozen(true);
    emitPlannerEvent("submit-attempt");

    const submissionController = new AbortController();
    const submissionTimeout = window.setTimeout(() => {
      submissionController.abort();
    }, SUBMISSION_TIMEOUT_MS);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodedBody,
        signal: submissionController.signal,
      });

      if (!response.ok) {
        throw new Error(`Netlify form submission returned ${response.status}.`);
      }

      isSubmitting = false;
      form.removeAttribute("aria-busy");
      form.classList.add("is-submitted");
      if (submitButton) submitButton.textContent = "Estimate revealed";
      revealEstimate();
    } catch (error) {
      console.error("The session estimate could not be submitted.", error);
      isSubmitting = false;
      form.dataset.submissionState = "error";
      form.removeAttribute("aria-busy");
      form.classList.remove("is-submitted");
      setSubmissionControlsFrozen(false);
      updateEstimate();

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitIdleText;
      }
      if (errorMessage) {
        errorMessage.textContent =
          "We couldn't confirm the submission, so your estimate is still locked. " +
          "Your entries are still here — please try again, or call or text " +
          "Lisa at (509) 948-7322.";
        errorMessage.hidden = false;
        errorMessage.focus({ preventScroll: true });
      }
      emitPlannerEvent("submit-error");
    } finally {
      window.clearTimeout(submissionTimeout);
    }
  });

  updateEstimate();
  planner.dataset.enhanced = "true";
  emitPlannerEvent("view");
};

export const initSessionPriceCalculators = (
  root: ParentNode = document,
): void => {
  root
    .querySelectorAll<HTMLElement>("[data-session-planner]")
    .forEach(initializePlanner);
};
