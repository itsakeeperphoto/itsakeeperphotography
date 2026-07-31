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
  },
  two: {
    id: "two",
    name: "#TWO",
    priceCents: 22_000,
    duration: "2 hours",
    locations: "1–3 locations",
    outfits: "2–3 outfits",
  },
  three: {
    id: "three",
    name: "#THREE",
    priceCents: 33_000,
    duration: "Up to 3 hours",
    locations: "3–4 locations",
    outfits: "3–4 outfits",
  },
} as const;

export const PHOTO_COLLECTIONS = {
  none: {
    id: "none",
    name: "None",
    priceCents: 0,
    details: [] as const,
  },
  one: {
    id: "one",
    name: "#1",
    priceCents: 49_598,
    details: [
      "(15) 4x6 linen prints",
      "(15) retouched downloads",
    ] as const,
  },
  two: {
    id: "two",
    name: "#2",
    priceCents: 116_948,
    details: [
      "Mini 5x5 signature album (30 images)",
      "(30) retouched downloads",
    ] as const,
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
  },
} as const;

export const SESSION_ADD_ONS = {
  extraImage: {
    id: "extraImage",
    name: "Extra retouched digital image",
    priceCents: 2_500,
  },
  extraOutfit: {
    id: "extraOutfit",
    name: "Additional outfit change",
    priceCents: 2_000,
  },
  rush: {
    id: "rush",
    name: "Rush delivery (48h)",
    priceCents: 7_500,
  },
} as const;

export const PEOPLE_INCLUDED = 5;
export const EXTRA_PERSON_PRICE_CENTS = 1_500;
export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 30;

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
  addOns?: SessionAddOnSelection;
}

export interface EstimateBreakdown {
  packageCents: number;
  collectionCents: number;
  extraPeopleCount: number;
  extraPeopleCents: number;
  addOnsCents: number;
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

  if (
    !Number.isInteger(selection.people) ||
    selection.people < MIN_PEOPLE ||
    selection.people > MAX_PEOPLE
  ) {
    throw new RangeError(
      `People must be a whole number from ${MIN_PEOPLE} to ${MAX_PEOPLE}.`,
    );
  }

  const packageCents = SESSION_PACKAGES[selection.packageId].priceCents;
  const collectionCents =
    PHOTO_COLLECTIONS[selection.collectionId].priceCents;
  const extraPeopleCount = Math.max(0, selection.people - PEOPLE_INCLUDED);
  const extraPeopleCents = extraPeopleCount * EXTRA_PERSON_PRICE_CENTS;
  const addOnsCents = Object.keys(selection.addOns ?? {}).reduce(
    (total, addOnId) => {
      if (!hasOwn(SESSION_ADD_ONS, addOnId)) {
        throw new RangeError(`Unknown add-on: ${addOnId}`);
      }

      return selection.addOns?.[addOnId]
        ? total + SESSION_ADD_ONS[addOnId].priceCents
        : total;
    },
    0,
  );

  const breakdown = {
    packageCents,
    collectionCents,
    extraPeopleCount,
    extraPeopleCents,
    addOnsCents,
  };

  return {
    selection,
    breakdown,
    totalCents:
      packageCents + collectionCents + extraPeopleCents + addOnsCents,
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
