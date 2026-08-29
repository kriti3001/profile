import ListingsPage from "@/components/ListingsPage";

export const metadata = { title: "Commercial Properties | BharosaGhar" };

export default function CommercialPage() {
  return (
    <ListingsPage
      category="commercial"
      title="Commercial Properties"
      subtitle="Shops, offices, warehouses and commercial land across our covered cities."
    />
  );
}
