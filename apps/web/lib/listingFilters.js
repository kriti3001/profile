// Listings filter state (FilterSidebar) and its mapping to GET /properties query params.

export const emptyFilters = {
  minPrice: "",
  maxPrice: "",
  bhk: [], // 1-4; 4 means "4+"
  furnishing: [],
  type: [],
  minArea: "",
  maxArea: "",
  amenities: [],
  facing: [],
  verifiedOnly: false,
};

/**
 * GET /properties query params for these filters. "4+" alone becomes minBhk=4; mixed with other
 * values it's expanded to 4..20, because the API ANDs bhk with minBhk.
 */
export function filtersToQuery(f) {
  const query = {
    minPrice: toInt(f.minPrice),
    maxPrice: toInt(f.maxPrice),
    minArea: toInt(f.minArea),
    maxArea: toInt(f.maxArea),
    furnishing: f.furnishing,
    propertyType: f.type,
    amenities: f.amenities,
    facing: f.facing,
    verified: f.verifiedOnly ? true : undefined,
  };
  const exact = f.bhk.filter((n) => n < 4);
  if (f.bhk.includes(4)) {
    if (exact.length === 0) query.minBhk = 4;
    else query.bhk = [...exact, ...Array.from({ length: 17 }, (_, i) => i + 4)];
  } else {
    query.bhk = exact;
  }
  return query;
}

function toInt(value) {
  const n = Number(value);
  return value === "" || !Number.isFinite(n) || n < 0 ? undefined : Math.floor(n);
}
