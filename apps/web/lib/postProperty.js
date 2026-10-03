// Post Property wizard: mapping the form data to the API's create body.
import { AMENITIES_BY_CATEGORY, PROPERTY_TYPE_LABELS } from "./propertyLabels";

const SHARED_TYPES = ["PG", "CO_LIVING"];
const COMMERCIAL_TYPES = ["OFFICE_SPACE", "RETAIL_SHOP", "WAREHOUSE"];

/** Amenity group offered for a property type (matches the listings filters). */
export function amenityOptionsFor(propertyType) {
  if (SHARED_TYPES.includes(propertyType)) return AMENITIES_BY_CATEGORY.pg;
  if (COMMERCIAL_TYPES.includes(propertyType)) return AMENITIES_BY_CATEGORY.commercial;
  return AMENITIES_BY_CATEGORY.rent;
}

/** Title used when the owner leaves the field blank, e.g. "2 BHK Apartment in Vijay Nagar". */
export function suggestedTitle(data) {
  if (!data.propertyType || !data.locality.trim()) return "";
  const bhk = data.bhk ? `${data.bhk} BHK ` : "";
  return `${bhk}${PROPERTY_TYPE_LABELS[data.propertyType]} in ${data.locality.trim()}`;
}

/** API ListingCategory: sale -> BUY; otherwise by property type (PG / COMMERCIAL / RENT). */
export function categoryFor(data) {
  if (data.purpose === "sale") return "BUY";
  if (SHARED_TYPES.includes(data.propertyType)) return "PG";
  if (COMMERCIAL_TYPES.includes(data.propertyType)) return "COMMERCIAL";
  return "RENT";
}

const intOrNull = (v) => (v === "" || v == null ? null : Number(v));

/** POST /properties body. Created as a DRAFT so it only goes public once its photos are attached. */
export function toCreateBody(data) {
  const category = categoryFor(data);
  return {
    title: data.title.trim() || suggestedTitle(data),
    description: data.description.trim(),
    category,
    propertyType: data.propertyType,
    price: Number(data.price),
    deposit: category === "BUY" ? null : intOrNull(data.deposit),
    bhk: intOrNull(data.bhk),
    area: Number(data.area),
    furnishingStatus: data.furnishing,
    availableFrom: data.availableFrom,
    city: data.city.trim(),
    locality: data.locality.trim(),
    address: data.address.trim() || null,
    amenities: data.amenities,
    facing: data.facing || null,
    floorNumber: intOrNull(data.floorNumber),
    totalFloors: intOrNull(data.totalFloors),
    status: "DRAFT",
  };
}
