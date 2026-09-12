export function formatINR(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-IN").format(amount);
}

// Indian short-form: ₹16,500/mo for rent, ₹98.0 L or ₹2.1 Cr for sale prices.
export function formatPrice(amount, category) {
  if (amount == null) return "Price on request";
  if (category === "buy") {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${formatINR(amount)}`;
  }
  return `₹${formatINR(amount)}/mo`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
