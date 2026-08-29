import Link from "next/link";
import { BedDouble, Ruler, MapPin, User2 } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import VerifiedBadge from "./VerifiedBadge";
import { formatPrice } from "@/lib/format";

export default function PropertyCard({ property }) {
  return (
    <Link
      href={`/property/${property.id}`}
      className="group block rounded-xl border border-black/10 bg-white overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all"
    >
      <div className="relative">
        <PlaceholderImage
          seed={property.images[0]}
          label={property.title}
          className="h-44 w-full"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {property.verified && <VerifiedBadge />}
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur text-[11px] font-medium px-2 py-0.5 text-primary-700 border border-black/10">
            <User2 size={11} className="mr-1" />
            {property.postedBy}
          </span>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-primary-700 text-base">
            {formatPrice(property.price, property.category)}
          </p>
        </div>
        <h3 className="mt-0.5 text-sm font-medium text-[#16211f] line-clamp-1 group-hover:text-primary-600">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-black/55">
          <MapPin size={12} />
          {property.locality}, {property.city}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-black/60 border-t border-black/5 pt-2.5">
          {property.bhk && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {property.bhk} BHK
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler size={13} /> {property.area} sqft
          </span>
          <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded bg-accent-50 text-accent-700 font-medium">
            {property.furnishing}
          </span>
        </div>
      </div>
    </Link>
  );
}
