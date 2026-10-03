import MyListingsClient from "@/components/dashboard/MyListingsClient";

// Listings are fetched in the browser (GET /properties/mine), inside DashboardShell's login gate.
export default function MyListingsPage() {
  return <MyListingsClient />;
}
