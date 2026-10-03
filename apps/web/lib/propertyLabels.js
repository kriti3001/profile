// Labels for the API's enum values, and conversion from an API property to what the UI renders.

// URL/category slugs used by the site's routes and components <-> API ListingCategory.
export const CATEGORY_TO_API = { rent: "RENT", buy: "BUY", pg: "PG", commercial: "COMMERCIAL" };
const CATEGORY_FROM_API = Object.fromEntries(Object.entries(CATEGORY_TO_API).map(([k, v]) => [v, k]));

export const PROPERTY_TYPE_LABELS = {
  APARTMENT: "Apartment",
  INDEPENDENT_HOUSE: "Independent House",
  VILLA: "Villa",
  PENTHOUSE: "Penthouse",
  PG: "PG",
  CO_LIVING: "Co-living",
  OFFICE_SPACE: "Office Space",
  RETAIL_SHOP: "Retail Shop",
  WAREHOUSE: "Warehouse",
};

// Which property types each listing category offers (filters and the post-property form).
export const TYPES_BY_CATEGORY = {
  rent: ["APARTMENT", "INDEPENDENT_HOUSE", "VILLA", "PENTHOUSE"],
  buy: ["APARTMENT", "INDEPENDENT_HOUSE", "VILLA", "PENTHOUSE"],
  pg: ["PG", "CO_LIVING"],
  commercial: ["OFFICE_SPACE", "RETAIL_SHOP", "WAREHOUSE"],
};

export const FURNISHING_LABELS = {
  UNFURNISHED: "Unfurnished",
  SEMI_FURNISHED: "Semi-Furnished",
  FULLY_FURNISHED: "Fully Furnished",
};

export const FACING_LABELS = {
  NORTH: "North",
  NORTH_EAST: "North-East",
  EAST: "East",
  SOUTH_EAST: "South-East",
  SOUTH: "South",
  SOUTH_WEST: "South-West",
  WEST: "West",
  NORTH_WEST: "North-West",
  CORNER_PLOT: "Corner Plot",
};

// Must match apps/api/src/properties/amenities.ts (the API rejects anything else), grouped by the
// kind of listing they're offered for.
const HOME_AMENITIES = [
  "Balcony", "Children's Play Area", "Clubhouse", "Covered Parking", "Gated Community", "Gym", "Lift",
  "Modular Kitchen", "Swimming Pool", "Water Purifier", "24x7 Security", "Power Backup", "Wi-Fi",
];
const SHARED_AMENITIES = [
  "AC", "CCTV", "Common Kitchen", "Housekeeping", "Laundry", "Meals Included", "24x7 Security", "Power Backup", "Wi-Fi",
];
const COMMERCIAL_AMENITIES = [
  "24x7 Access", "Conference Room", "Display Windows", "High Footfall", "High-Speed Internet", "Loading Dock",
  "Parking", "Power Load 5kW", "24x7 Security", "Power Backup", "Wi-Fi",
];
export const AMENITIES_BY_CATEGORY = {
  rent: HOME_AMENITIES,
  buy: HOME_AMENITIES,
  pg: SHARED_AMENITIES,
  commercial: COMMERCIAL_AMENITIES,
};

/** "7th of 11", "Ground (of 4)", "Ground", "Whole building (G+2)", or null. */
export function formatFloor(floorNumber, totalFloors) {
  if (floorNumber == null) return totalFloors != null ? `Whole building (G+${totalFloors})` : null;
  if (floorNumber === 0) return totalFloors ? `Ground (of ${totalFloors})` : "Ground";
  return totalFloors != null ? `${ordinal(floorNumber)} of ${totalFloors}` : `${ordinal(floorNumber)} floor`;
}

function ordinal(n) {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
  return `${n}${suffix}`;
}

/**
 * The API's Property (see apps/api property.entity.ts) in the shape the UI components render.
 * Keeps the API's own fields (id, title, price, ...) and adds display-ready ones.
 */
export function toViewProperty(p) {
  return {
    ...p,
    category: CATEGORY_FROM_API[p.category] ?? "rent",
    type: PROPERTY_TYPE_LABELS[p.propertyType] ?? p.propertyType,
    furnishing: FURNISHING_LABELS[p.furnishingStatus] ?? p.furnishingStatus,
    facingLabel: p.facing ? FACING_LABELS[p.facing] : null,
    floor: formatFloor(p.floorNumber, p.totalFloors),
    verified: p.isVerified,
    amenities: p.amenities ?? [],
    photoUrls: (p.photos ?? []).map((ph) => ph.url),
  };
}

/** Route for a property's detail page (one static page; the id is read client-side). */
export const propertyHref = (id) => `/property/?id=${encodeURIComponent(id)}`;
