import PropertyDetailClient from "@/components/PropertyDetailClient";

export const metadata = { title: "Property Details | BharosaGhar" };

// One static page for every listing: /property/?id=<uuid>. Listings are created after the site is
// built, so a dynamic /property/[id] route can't be pre-rendered for them in a static export.
// PropertyDetailClient reads the id and fetches the listing in the browser.
export default function PropertyPage() {
  return <PropertyDetailClient />;
}
