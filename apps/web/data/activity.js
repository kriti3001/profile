// Mock per-property view analytics for the owner/broker dashboard.
// Deterministic per property id so numbers stay stable across renders.
// TODO: replace with real pageview analytics (e.g. aggregated from a view-tracking event).
// FNV-1a hash, salting the *string* (not just an XOR'd seed) per derived
// field so nearby ids (p1, p2, p3...) don't produce visibly sequential or
// correlated numbers across fields.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function getViewActivity(propertyId) {
  const totalViews = 60 + (hash(`${propertyId}:views`) % 340);
  const viewsThisWeek = 4 + (hash(`${propertyId}:week`) % 26);
  const lastViewedHoursAgo = 1 + (hash(`${propertyId}:recency`) % 30);
  return { totalViews, viewsThisWeek, lastViewedHoursAgo };
}
