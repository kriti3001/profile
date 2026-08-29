import { Suspense } from "react";
import ListingsPage from "@/components/ListingsPage";

export const metadata = { title: "Homes for Rent | BharosaGhar" };

export default function RentPage() {
  return (
    <Suspense fallback={null}>
      <ListingsPage
        category="rent"
        title="Homes for Rent"
        subtitle="Verified apartments and houses available to rent, updated daily."
      />
    </Suspense>
  );
}
