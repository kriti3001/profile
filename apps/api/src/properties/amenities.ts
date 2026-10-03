/**
 * Amenity labels a listing may have, stored as-is in Property.amenities. Taken verbatim from the mock data in
 * apps/web/data/properties.js so it can be migrated without mapping. Add new labels here; no migration needed.
 *
 * Merged duplicates: "Wi-Fi Ready" -> "Wi-Fi", "Security" -> "24x7 Security". "Parking" (any parking) and
 * "Covered Parking" are deliberately separate amenities.
 */
export const AMENITIES = [
  // Homes (apartments, houses, villas, penthouses)
  'Balcony',
  "Children's Play Area",
  'Clubhouse',
  'Covered Parking',
  'Gated Community',
  'Gym',
  'Lift',
  'Modular Kitchen',
  'Swimming Pool',
  'Water Purifier',
  // Shared living (PG, co-living)
  'AC',
  'CCTV',
  'Common Kitchen',
  'Housekeeping',
  'Laundry',
  'Meals Included',
  // Commercial (shops, offices, warehouses)
  '24x7 Access',
  'Conference Room',
  'Display Windows',
  'High Footfall',
  'High-Speed Internet',
  'Loading Dock',
  'Parking',
  'Power Load 5kW',
  // Several kinds
  '24x7 Security',
  'Power Backup',
  'Wi-Fi',
] as const;

export type Amenity = (typeof AMENITIES)[number];
