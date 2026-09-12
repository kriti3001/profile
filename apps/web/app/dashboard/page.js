import { properties } from "@/data/properties";
import MyListingsClient from "@/components/dashboard/MyListingsClient";

export default function MyListingsPage() {
  const mine = properties.slice(0, 5);
  return <MyListingsClient initialListings={mine} />;
}
