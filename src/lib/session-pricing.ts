export const SESSION_SERVICES = {
  senior: {
    id: "senior",
    name: "Senior",
    image: "/uploads/review-isabella-senior-golden-hour-tricities.jpg",
  },
  family: {
    id: "family",
    name: "Family",
    image: "/uploads/family-golden-light-richland.jpg",
  },
  newborn: {
    id: "newborn",
    name: "Newborn",
    image: "/uploads/newborn-portrait-with-mother-richland.jpg",
  },
  branding: {
    id: "branding",
    name: "Branding",
    image: "/uploads/business-branding-portrait-richland.jpg",
  },
  headshots: {
    id: "headshots",
    name: "Headshots",
    image: "/uploads/review-lisa-griffith-headshot-tricities.jpg",
  },
} as const;

export const SESSION_PACKAGES = {
  one: {
    id: "one",
    name: "#ONE",
    priceCents: 16_000,
    duration: "Up to 90 minutes",
    locations: "1–2 locations",
    outfits: "2 outfits",
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  two: {
    id: "two",
    name: "#TWO",
    priceCents: 22_000,
    duration: "2 hours",
    locations: "1–3 locations",
    outfits: "2–3 outfits",
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  three: {
    id: "three",
    name: "#THREE",
    priceCents: 33_000,
    duration: "Up to 3 hours",
    locations: "3–4 locations",
    outfits: "3–4 outfits",
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  headshot: {
    id: "headshot",
    name: "HEADSHOT",
    priceCents: 17_500,
    duration: "20–30 minutes",
    locations: "1 high-resolution digital download",
    outfits: "Commercial usage included",
    serviceIds: ["headshots"] as const,
  },
} as const;

export const PHOTO_COLLECTIONS = {
  none: {
    id: "none",
    name: "None",
    priceCents: 0,
    details: [] as const,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  one: {
    id: "one",
    name: "#1",
    priceCents: 49_598,
    details: [
      "(15) 4x6 linen prints",
      "(15) retouched downloads",
    ] as const,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  two: {
    id: "two",
    name: "#2",
    priceCents: 116_948,
    details: [
      "Mini 5x5 signature album (30 images)",
      "(30) retouched downloads",
    ] as const,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  three: {
    id: "three",
    name: "#3",
    priceCents: 179_999,
    details: [
      "Entire gallery",
      "(100) retouched downloads",
      "(1) 8x10 leather-bound album (30 images)",
    ] as const,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  headshotGallery: {
    id: "headshotGallery",
    name: "Included gallery",
    priceCents: 0,
    details: [
      "Online gallery with additional purchase options",
    ] as const,
    serviceIds: ["headshots"] as const,
  },
} as const;

export const SESSION_ADD_ONS = {
  extraImage: {
    id: "extraImage",
    name: "Extra retouched digital image",
    priceCents: 2_500,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  extraOutfit: {
    id: "extraOutfit",
    name: "Additional outfit change",
    priceCents: 2_000,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
  rush: {
    id: "rush",
    name: "Rush delivery (48h)",
    priceCents: 7_500,
    serviceIds: ["senior", "family", "newborn", "branding"] as const,
  },
} as const;

export const PEOPLE_INCLUDED = 5;
export const EXTRA_PERSON_PRICE_CENTS = 1_500;
export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 30;
export const HEADSHOT_PEOPLE_INCLUDED = 1;
export const TRAVEL_INCLUDED_MILES = 25;
export const TRAVEL_PRICE_PER_MILE_CENTS = 200;

export type SessionServiceId = keyof typeof SESSION_SERVICES;
export type SessionPackageId = keyof typeof SESSION_PACKAGES;
export type PhotoCollectionId = keyof typeof PHOTO_COLLECTIONS;
export type SessionAddOnId = keyof typeof SESSION_ADD_ONS;

export type SessionAddOnSelection = Readonly<
  Partial<Record<SessionAddOnId, boolean>>
>;

export interface EstimateSelection {
  serviceId: SessionServiceId;
  packageId: SessionPackageId;
  collectionId: PhotoCollectionId;
  people: number;
  travelMiles: number;
  addOns?: SessionAddOnSelection;
}

export interface EstimateBreakdown {
  packageCents: number;
  collectionCents: number;
  peopleIncluded: number;
  extraPeopleCount: number;
  extraPeopleCents: number;
  extraPeopleRequireQuote: boolean;
  addOnsCents: number;
  travelMiles: number;
  billableTravelMiles: number;
  travelCents: number;
}

export interface SessionEstimate {
  selection: EstimateSelection;
  breakdown: EstimateBreakdown;
  totalCents: number;
}

const hasOwn = <T extends object>(
  value: T,
  key: PropertyKey,
): key is keyof T => Object.prototype.hasOwnProperty.call(value, key);

export const isPackageAvailableForService = (
  packageId: SessionPackageId,
  serviceId: SessionServiceId,
): boolean =>
  (SESSION_PACKAGES[packageId].serviceIds as readonly string[]).includes(
    serviceId,
  );

export const isCollectionAvailableForService = (
  collectionId: PhotoCollectionId,
  serviceId: SessionServiceId,
): boolean =>
  (PHOTO_COLLECTIONS[collectionId].serviceIds as readonly string[]).includes(
    serviceId,
  );

export const isAddOnAvailableForService = (
  addOnId: SessionAddOnId,
  serviceId: SessionServiceId,
): boolean =>
  (SESSION_ADD_ONS[addOnId].serviceIds as readonly string[]).includes(
    serviceId,
  );

/**
 * Calculates a session estimate entirely in cents.
 *
 * Runtime validation protects browser form values that may not have passed
 * through TypeScript before reaching this function.
 */
export const calculateEstimate = (
  selection: EstimateSelection,
): SessionEstimate => {
  if (!hasOwn(SESSION_SERVICES, selection.serviceId)) {
    throw new RangeError(`Unknown service: ${selection.serviceId}`);
  }

  if (!hasOwn(SESSION_PACKAGES, selection.packageId)) {
    throw new RangeError(`Unknown package: ${selection.packageId}`);
  }

  if (!hasOwn(PHOTO_COLLECTIONS, selection.collectionId)) {
    throw new RangeError(`Unknown collection: ${selection.collectionId}`);
  }

  if (!isPackageAvailableForService(selection.packageId, selection.serviceId)) {
    throw new RangeError(
      `Package ${selection.packageId} is not available for ${selection.serviceId}.`,
    );
  }

  if (
    !isCollectionAvailableForService(
      selection.collectionId,
      selection.serviceId,
    )
  ) {
    throw new RangeError(
      `Collection ${selection.collectionId} is not available for ${selection.serviceId}.`,
    );
  }

  if (
    !Number.isInteger(selection.people) ||
    selection.people < MIN_PEOPLE ||
    selection.people > MAX_PEOPLE
  ) {
    throw new RangeError(
      `People must be a whole number from ${MIN_PEOPLE} to ${MAX_PEOPLE}.`,
    );
  }
  if (!Number.isInteger(selection.travelMiles) || selection.travelMiles < 0) {
    throw new RangeError("Travel miles must be a non-negative whole number.");
  }

  const packageCents = SESSION_PACKAGES[selection.packageId].priceCents;
  const collectionCents =
    PHOTO_COLLECTIONS[selection.collectionId].priceCents;
  const peopleIncluded =
    selection.serviceId === "headshots"
      ? HEADSHOT_PEOPLE_INCLUDED
      : PEOPLE_INCLUDED;
  const extraPeopleCount = Math.max(0, selection.people - peopleIncluded);
  const extraPeopleRequireQuote =
    selection.serviceId === "headshots" && extraPeopleCount > 0;
  const extraPeopleCents = extraPeopleRequireQuote
    ? 0
    : extraPeopleCount * EXTRA_PERSON_PRICE_CENTS;
  const addOnsCents = Object.keys(selection.addOns ?? {}).reduce(
    (total, addOnId) => {
      if (!hasOwn(SESSION_ADD_ONS, addOnId)) {
        throw new RangeError(`Unknown add-on: ${addOnId}`);
      }

      if (
        selection.addOns?.[addOnId] &&
        !isAddOnAvailableForService(addOnId, selection.serviceId)
      ) {
        throw new RangeError(
          `Add-on ${addOnId} is not available for ${selection.serviceId}.`,
        );
      }

      return selection.addOns?.[addOnId]
        ? total + SESSION_ADD_ONS[addOnId].priceCents
        : total;
    },
    0,
  );
  const billableTravelMiles = Math.max(
    0,
    selection.travelMiles - TRAVEL_INCLUDED_MILES,
  );
  const travelCents = billableTravelMiles * TRAVEL_PRICE_PER_MILE_CENTS;

  const breakdown = {
    packageCents,
    collectionCents,
    peopleIncluded,
    extraPeopleCount,
    extraPeopleCents,
    extraPeopleRequireQuote,
    addOnsCents,
    travelMiles: selection.travelMiles,
    billableTravelMiles,
    travelCents,
  };

  return {
    selection,
    breakdown,
    totalCents:
      packageCents +
      collectionCents +
      extraPeopleCents +
      addOnsCents +
      travelCents,
  };
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatUsd = (cents: number): string => {
  if (!Number.isInteger(cents)) {
    throw new TypeError("Currency must be provided as a whole number of cents.");
  }

  return usdFormatter.format(cents / 100);
};
