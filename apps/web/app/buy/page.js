import ListingsPage from "@/components/ListingsPage";

export const metadata = { title: "Homes for Sale | BharosaGhar" };

export default function BuyPage() {
  return (
    <ListingsPage
      category="buy"
      title="Homes for Sale"
      subtitle="Ready-to-move and under-construction properties, verified for a smoother purchase."
    />
  );
}
