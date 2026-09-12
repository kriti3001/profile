// Mock rental market trend data — a lightweight "PropIndex"-style feature.
// All numbers here are hand-authored sample data for the prototype, not a
// real analytics pipeline.
// TODO: replace with a real trend pipeline aggregated from actual listing/
// transaction history once BharosaGhar has enough live data to be meaningful.

export const trendCities = ["Indore", "Coimbatore", "Nagpur", "Lucknow", "Jaipur", "Bhubaneswar"];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function buildMonthly(values) {
  return months.map((month, i) => ({ month, avgRent: values[i] }));
}

// Each city's `driver` is the hand-written "why" clause; the headline
// percentage in the insight sentence is always computed from `monthly`
// (see getInsight below) so the two can never drift out of sync.
export const trendData = {
  Indore: {
    monthly: buildMonthly([14900, 15050, 15200, 15300, 15400, 15550, 15700, 15800]),
    localities: [
      { name: "Vijay Nagar", avgRent: 16200, changePct: 4.2 },
      { name: "Bhawarkuan", avgRent: 13800, changePct: 2.1 },
      { name: "Rajendra Nagar", avgRent: 12500, changePct: -1.3 },
    ],
    driver: "demand near the Vijay Nagar IT corridor",
  },
  Coimbatore: {
    monthly: buildMonthly([10500, 10600, 10700, 10800, 10950, 11050, 11150, 11250]),
    localities: [
      { name: "RS Puram", avgRent: 11800, changePct: 3.6 },
      { name: "Peelamedu", avgRent: 10200, changePct: 5.1 },
      { name: "Saibaba Colony", avgRent: 9600, changePct: 1.4 },
    ],
    driver: "new IT campuses driving demand around Peelamedu",
  },
  Nagpur: {
    monthly: buildMonthly([20400, 20600, 20750, 20900, 21100, 21250, 21450, 21600]),
    localities: [
      { name: "Dharampeth", avgRent: 23500, changePct: 4.8 },
      { name: "Civil Lines", avgRent: 21200, changePct: 2.9 },
      { name: "Sadar", avgRent: 17800, changePct: -0.6 },
    ],
    driver: "steady demand in Dharampeth and Civil Lines",
  },
  Lucknow: {
    monthly: buildMonthly([22600, 22900, 23150, 23400, 23700, 24000, 24300, 24550]),
    localities: [
      { name: "Gomti Nagar", avgRent: 26400, changePct: 5.9 },
      { name: "Hazratganj", avgRent: 22100, changePct: 3.2 },
      { name: "Indira Nagar", avgRent: 18900, changePct: 1.8 },
    ],
    driver: "Gomti Nagar continuing to lead demand citywide",
  },
  Jaipur: {
    monthly: buildMonthly([12800, 12900, 13050, 13200, 13300, 13400, 13550, 13700]),
    localities: [
      { name: "Malviya Nagar", avgRent: 14800, changePct: 4.5 },
      { name: "Vaishali Nagar", avgRent: 13200, changePct: 3.0 },
      { name: "C-Scheme", avgRent: 16500, changePct: 2.2 },
    ],
    driver: "renewed demand from young professionals in Malviya Nagar",
  },
  Bhubaneswar: {
    monthly: buildMonthly([14300, 14400, 14550, 14700, 14850, 15000, 15100, 15250]),
    localities: [
      { name: "Patia", avgRent: 16400, changePct: 5.4 },
      { name: "Chandrasekharpur", avgRent: 14700, changePct: 3.1 },
      { name: "Jaydev Vihar", avgRent: 13900, changePct: 0.9 },
    ],
    driver: "Patia's growing IT corridor",
  },
};

export function getTrend(city) {
  return trendData[city] || null;
}

// % change from first to last month in the trend window — used for compact
// widgets that just need a headline number.
export function getOverallChangePct(city) {
  const trend = getTrend(city);
  if (!trend) return null;
  const first = trend.monthly[0].avgRent;
  const last = trend.monthly[trend.monthly.length - 1].avgRent;
  return Number((((last - first) / first) * 100).toFixed(1));
}

// Composed from the real computed change so the sentence can never quote a
// number that disagrees with the chart above it.
export function getInsight(city) {
  const trend = getTrend(city);
  if (!trend) return "";
  const pct = getOverallChangePct(city);
  const verb = pct >= 0 ? "risen" : "eased";
  return `Rents in ${city} have ${verb} ${Math.abs(pct)}% over the past 8 months, driven by ${trend.driver}.`;
}
