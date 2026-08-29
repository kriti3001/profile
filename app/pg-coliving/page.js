import { Suspense } from "react";
import ListingsPage from "@/components/ListingsPage";

export const metadata = { title: "PG & Co-living | BharosaGhar" };

export default function PgPage() {
  return (
    <Suspense fallback={null}>
      <ListingsPage
        category="pg"
        title="PG & Co-living Spaces"
        subtitle="Furnished rooms and co-living spaces for students and working professionals."
      />
    </Suspense>
  );
}
