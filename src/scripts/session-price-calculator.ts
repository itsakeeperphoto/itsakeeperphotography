import {
  MAX_PEOPLE,
  MIN_PEOPLE,
  PEOPLE_INCLUDED,
  PHOTO_COLLECTIONS,
  SESSION_ADD_ONS,
  SESSION_PACKAGES,
  SESSION_SERVICES,
  TRAVEL_INCLUDED_MILES,
  calculateEstimate,
  formatUsd,
  type PhotoCollectionId,
  type SessionAddOnId,
  type SessionPackageId,
  type SessionServiceId,
} from "../lib/session-pricing";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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

const normalizeTravelMiles = (input: HTMLInputElement): number => {
  const parsedValue = Number(input.value);
  const miles = Number.isFinite(parsedValue)
    ? Math.max(0, Math.trunc(parsedValue))
    : 0;

  input.value = String(miles);
  return miles;
};

const isValidatableControl = (
  element: Element,
): element is ValidatableControl =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLSelectElement ||
  element instanceof HTMLTextAreaElement;

const initializePlanner = (planner: HTMLElement): void => {
  if (planner.hasAttribute("data-enhanced")) return;

  const form = query<HTMLFormElement>(
    planner,
    "[data-session-estimate-form]",
  );
  const peopleInput = query<HTMLInputElement>(planner, "[data-people-input]");
  const travelInput = query<HTMLInputElement>(planner, "[data-travel-input]");
  const decreaseButton = query<HTMLButtonElement>(
    planner,
    "[data-people-decrease]",
  );
  const increaseButton = query<HTMLButtonElement>(
    planner,
    "[data-people-increase]",
  );
  const travelDecreaseButton = query<HTMLButtonElement>(
    planner,
    "[data-travel-decrease]",
  );
  const travelIncreaseButton = query<HTMLButtonElement>(
    planner,
    "[data-travel-increase]",
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
  const progressButtons = Array.from(
    planner.querySelectorAll<HTMLButtonElement>("[data-planner-progress]"),
  );
  const phases = Array.from(
    planner.querySelectorAll<HTMLElement>("[data-planner-phase]"),
  );

  if (!form || !peopleInput || !travelInput) return;

  const isAvailableForService = (
    control: HTMLInputElement,
    serviceId: SessionServiceId,
  ): boolean =>
    (control.dataset.serviceIds || "")
      .split(",")
      .filter(Boolean)
      .includes(serviceId);

  const syncAvailableChoices = (serviceId: SessionServiceId): void => {
    const syncRadioGroup = (
      rowSelector: string,
      inputSelector: string,
    ): void => {
      const rows = Array.from(
        form.querySelectorAll<HTMLElement>(rowSelector),
      );
      const availableInputs: HTMLInputElement[] = [];

      rows.forEach((row) => {
        const input = query<HTMLInputElement>(row, inputSelector);
        if (!input) return;
        const available = isAvailableForService(input, serviceId);
        row.hidden = !available;
        input.disabled = !available;
        if (!available) input.checked = false;
        if (available) availableInputs.push(input);
      });

      if (!availableInputs.some((input) => input.checked)) {
        const firstAvailable = availableInputs[0];
        if (firstAvailable) firstAvailable.checked = true;
      }
    };

    syncRadioGroup("[data-package-row]", "[data-package-radio]");
    syncRadioGroup("[data-collection-row]", "[data-collection-radio]");

    form
      .querySelectorAll<HTMLElement>("[data-addon-row]")
      .forEach((row) => {
        const input = query<HTMLInputElement>(row, "[data-addon-checkbox]");
        if (!input) return;
        const available = isAvailableForService(input, serviceId);
        row.hidden = !available;
        input.disabled = !available;
        if (!available) input.checked = false;
      });

    const isHeadshot = serviceId === "headshots";
    const isBranding = serviceId === "branding";
    const headshotPurchaseNote = query<HTMLElement>(
      form,
      "[data-headshot-purchase-note]",
    );
    if (headshotPurchaseNote) headshotPurchaseNote.hidden = !isHeadshot;
    const brandingPurchaseNote = query<HTMLElement>(
      form,
      "[data-branding-purchase-note]",
    );
    if (brandingPurchaseNote) brandingPurchaseNote.hidden = !isBranding;
    setText(
      form,
      "[data-people-policy]",
      isHeadshot
        ? "The individual Headshot Package covers one person. Add the full headcount for a team and Lisa will confirm a custom team estimate."
        : "Five are included; each additional person adds $15.",
    );
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
    if (!serviceRadio) return;

    const serviceId = serviceRadio.value as SessionServiceId;
    syncAvailableChoices(serviceId);

    const packageRadio = query<HTMLInputElement>(
      form,
      "[data-package-radio]:checked",
    );
    const collectionRadio = query<HTMLInputElement>(
      form,
      "[data-collection-radio]:checked",
    );

    if (!packageRadio || !collectionRadio) return;

    const packageId = packageRadio.value as SessionPackageId;
    const collectionId = collectionRadio.value as PhotoCollectionId;
    const people = normalizePeople(peopleInput);
    const travelMiles = normalizeTravelMiles(travelInput);
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
        travelMiles,
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
    const formattedTravelFee = formatUsd(estimate.breakdown.travelCents);
    const formattedTotal = formatUsd(estimate.totalCents);
    const taxSuffix = serviceId === "headshots" ? " + tax" : "";
    const formattedPackagePriceWithTax = `${formattedPackagePrice}${taxSuffix}`;
    const formattedTotalWithTax = `${formattedTotal}${taxSuffix}`;
    const addOnNames = selectedAddOns.map((addOn) => addOn.name);
    const addOnLabel = addOnNames.length > 0 ? addOnNames.join(", ") : "None";
    const peopleLabel = estimate.breakdown.extraPeopleRequireQuote
      ? `${people} · Team pricing confirmed by Lisa`
      : estimate.breakdown.extraPeopleCount > 0
        ? `${people} · ${estimate.breakdown.extraPeopleCount} extra · ${formattedExtraPeopleFee}`
        : `${people} · Included`;
    const collectionLabel =
      collection.id === "none"
        ? "No collection yet"
        : collection.id === "headshotGallery"
          ? "Included online gallery"
          : collection.id === "brandingImages"
            ? "$75 per selected image · purchased after the session"
        : `Collection ${collection.name} · ${formattedCollectionPrice}`;
    const addOnReceiptLabel =
      selectedAddOns.length > 0
        ? `${addOnLabel} · ${formattedAddOnTotal}`
        : "None";
    const travelLabel =
      estimate.breakdown.billableTravelMiles > 0
        ? `${travelMiles} miles · ${estimate.breakdown.billableTravelMiles} additional · ${formattedTravelFee}`
        : `${travelMiles} miles · Included`;

    setText(planner, "[data-receipt-service]", serviceName);
    setText(
      planner,
      "[data-receipt-package]",
      `${selectedPackage.name} · ${formattedPackagePriceWithTax}`,
    );
    setText(planner, "[data-receipt-people]", peopleLabel);
    setText(planner, "[data-receipt-collection]", collectionLabel);
    setText(planner, "[data-receipt-addons]", addOnReceiptLabel);
    setText(planner, "[data-receipt-travel]", travelLabel);

    if (receiptImage) {
      receiptImage.src = serviceImage;
      receiptImage.alt = `${serviceName} photography session preview`;
    }

    const totalChanged =
      receiptTotal?.textContent?.trim() !== formattedTotalWithTax ||
      mobileTotal?.textContent?.trim() !== formattedTotalWithTax;
    if (receiptTotal) receiptTotal.textContent = formattedTotalWithTax;
    if (mobileTotal) mobileTotal.textContent = formattedTotalWithTax;
    if (totalChanged) {
      setText(
        planner,
        "[data-total-live]",
        `Estimated total ${formattedTotalWithTax}.`,
      );
      animateTotal(receiptTotal);
      animateTotal(mobileTotal);
    }

    if (estimate.breakdown.extraPeopleRequireQuote) {
      setText(
        planner,
        "[data-people-status]",
        `${people} people selected. Lisa will confirm custom team pricing.`,
      );
    } else if (estimate.breakdown.extraPeopleCount > 0) {
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

    if (estimate.breakdown.billableTravelMiles > 0) {
      setText(
        planner,
        "[data-travel-status]",
        `${estimate.breakdown.billableTravelMiles} miles beyond the included ${TRAVEL_INCLUDED_MILES} add ${formattedTravelFee}.`,
      );
    } else {
      setText(
        planner,
        "[data-travel-status]",
        `Travel up to ${TRAVEL_INCLUDED_MILES} miles is included.`,
      );
    }

    if (decreaseButton) decreaseButton.disabled = people <= MIN_PEOPLE;
    if (increaseButton) increaseButton.disabled = people >= MAX_PEOPLE;
    if (travelDecreaseButton) travelDecreaseButton.disabled = travelMiles <= 0;

    setEstimateField(planner, "package_name", selectedPackage.name);
    setEstimateField(planner, "package_price", formattedPackagePriceWithTax);
    setEstimateField(
      planner,
      "extra_people_fee",
      estimate.breakdown.extraPeopleRequireQuote
        ? "Custom team quote"
        : formattedExtraPeopleFee,
    );
    setEstimateField(
      planner,
      "team_pricing_status",
      estimate.breakdown.extraPeopleRequireQuote
        ? "Requires custom team quote"
        : "Not required",
    );
    setEstimateField(planner, "collection_name", collection.name);
    setEstimateField(planner, "collection_price", formattedCollectionPrice);
    setEstimateField(planner, "selected_addons", addOnLabel);
    setEstimateField(planner, "addon_total", formattedAddOnTotal);
    setEstimateField(
      planner,
      "billable_travel_miles",
      String(estimate.breakdown.billableTravelMiles),
    );
    setEstimateField(planner, "travel_fee", formattedTravelFee);
    setEstimateField(planner, "estimated_total", formattedTotalWithTax);
    setEstimateField(planner, "calculation_status", "Calculated in browser");
    setEstimateField(
      planner,
      "estimate_breakdown",
      [
        `Session: ${serviceName}`,
        `Package: ${selectedPackage.name} (${formattedPackagePriceWithTax})`,
        `People: ${people} (${estimate.breakdown.extraPeopleRequireQuote ? "custom team quote required" : `${estimate.breakdown.extraPeopleCount} additional, ${formattedExtraPeopleFee}`})`,
        `Collection: ${collection.name} (${formattedCollectionPrice})`,
        `Add-ons: ${addOnLabel} (${formattedAddOnTotal})`,
        `Travel: ${travelMiles} miles (${estimate.breakdown.billableTravelMiles} additional, ${formattedTravelFee})`,
        `Estimated total: ${formattedTotalWithTax}`,
      ].join("; "),
    );
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
    if (
      event.target instanceof Element &&
      event.target.matches(
        "[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input], [data-travel-input]",
      )
    ) {
      updateEstimate();
    }
  });
  form.addEventListener("change", (event) => {
    clearInvalidState(event.target);
    if (
      event.target instanceof Element &&
      event.target.matches(
        "[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input], [data-travel-input]",
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

  travelDecreaseButton?.addEventListener("click", () => {
    const miles = normalizeTravelMiles(travelInput);
    travelInput.value = String(Math.max(0, miles - 1));
    travelInput.removeAttribute("aria-invalid");
    updateEstimate();
  });

  travelIncreaseButton?.addEventListener("click", () => {
    const miles = normalizeTravelMiles(travelInput);
    travelInput.value = String(miles + 1);
    travelInput.removeAttribute("aria-invalid");
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

  query<HTMLButtonElement>(planner, "[data-review-estimate]")?.addEventListener(
    "click",
    () => {
      if (receipt) scrollToElement(receipt);
    },
  );

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

  updateEstimate();
  planner.dataset.enhanced = "true";
};

export const initSessionPriceCalculators = (
  root: ParentNode = document,
): void => {
  root
    .querySelectorAll<HTMLElement>("[data-session-planner]")
    .forEach(initializePlanner);
};
