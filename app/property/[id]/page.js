import { notFound } from "next/navigation";
import { getPropertyById, getSimilarProperties } from "@/data/properties";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return { title: "Property Not Found | BharosaGhar" };
  return { title: `${property.title} | BharosaGhar` };
}

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const similar = getSimilarProperties(property);

  return <PropertyDetailClient property={property} similar={similar} />;
}
