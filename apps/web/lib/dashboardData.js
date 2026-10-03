import { apiFetch } from "./api";
import { toViewProperty } from "./propertyLabels";

export const SOURCE_LABELS = {
  DIRECT: "BharosaGhar direct",
  NINETY_NINE_ACRES: "99acres",
  MAGICBRICKS: "MagicBricks",
  HOUSING_COM: "Housing.com",
  NOBROKER: "NoBroker",
};

/**
 * The signed-in user's properties (GET /properties/mine), each with its enquiries. The API has no
 * "all my enquiries" endpoint, so enquiries are fetched per property, in parallel.
 */
export async function loadMyListings(getAccessToken, { signal } = {}) {
  const token = await getAccessToken();
  const properties = await apiFetch("/properties/mine", { token, signal });
  const enquiries = await Promise.all(
    properties.map((p) => apiFetch(`/properties/${p.id}/enquiries`, { token, signal })),
  );
  return properties.map((p, i) => ({ property: toViewProperty(p), enquiries: enquiries[i] }));
}
