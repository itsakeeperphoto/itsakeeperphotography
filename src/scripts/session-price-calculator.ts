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
  const progressButtons = Array.from(
    planner.querySelectorAll<HTMLButtonElement>("[data-planner-progress]"),
  );
  const phases = Array.from(
    planner.querySelectorAll<HTMLElement>("[data-planner-phase]"),
  );

  if (!form || !peopleInput) return;

  const setActivePhase = (phaseName: string): void => {
    progressButtons.forEach((button) => {
      if (button.dataset.plannerProgress === phaseName) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });
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
    if (totalChanged) {
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
        "[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input]",
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
        "[data-service-radio], [data-package-radio], [data-collection-radio], [data-addon-checkbox], [data-people-input]",
      )
    ) {
      updateEstimate();
    }
  });

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
