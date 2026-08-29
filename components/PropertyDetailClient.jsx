"use client";

import { useState } from "react";
import {
  BedDouble,
  Ruler,
  Layers,
  Compass,
  Wallet,
  CalendarDays,
  Sofa,
  MapPin,
  School,
  Hospital,
  TrainFront,
  Phone,
} from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import VerifiedBadge from "./VerifiedBadge";
import EnquiryModal from "./EnquiryModal";
import PropertyCarousel from "./PropertyCarousel";
import { formatPrice, formatINR, formatDate } from "@/lib/format";

export default function PropertyDetailClient({ property, similar }) {
  const [activeImage, setActiveImage] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const details = [
    { icon: Wallet, label: property.category === "buy" ? "Price" : "Rent", value: formatPrice(property.price, property.category) },
    property.deposit && { icon: Wallet, label: "Deposit", value: `₹${formatINR(property.deposit)}` },
    property.bhk && { icon: BedDouble, label: "BHK", value: `${property.bhk} BHK` },
    { icon: Ruler, label: "Area", value: `${property.area} sqft` },
    { icon: Sofa, label: "Furnishing", value: property.furnishing },
    { icon: Layers, label: "Floor", value: property.floor },
    { icon: Compass, label: "Facing", value: property.facing },
    { icon: CalendarDays, label: "Available From", value: formatDate(property.availableFrom) },
  ].filter(Boolean);

  return (
    <div className="container-page py-8">
      <nav className="text-xs text-black/45 mb-4">
        <span className="capitalize">{property.category}</span> / {property.city} / {property.locality}
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PlaceholderImage
            seed={property.images[activeImage]}
            label={property.title}
            className="h-72 sm:h-96 w-full rounded-2xl"
            iconSize={30}
          />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {property.images.map((seed, i) => (
              <button
                key={seed}
                onClick={() => setActiveImage(i)}
                className={`rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-primary-500" : "border-transparent"
                }`}
              >
                <PlaceholderImage seed={seed} className="h-16 sm:h-20 w-full" iconSize={14} />
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-900">{property.title}</h1>
                {property.verified && <VerifiedBadge size="md" withTooltip />}
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-sm text-black/55">
                <MapPin size={14} /> {property.locality}, {property.city}
              </p>
            </div>
            <p className="text-2xl font-bold text-primary-700 whitespace-nowrap">
              {formatPrice(property.price, property.category)}
            </p>
          </div>

          <p className="mt-4 text-sm text-black/65 leading-relaxed max-w-2xl">
            {property.description}
          </p>

          <div className="mt-8">
            <h2 className="font-semibold text-primary-800 mb-3">Property Details</h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 rounded-xl border border-black/10 p-5">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm border-b border-black/5 pb-2.5 last:border-0">
                  <span className="flex items-center gap-2 text-black/55">
                    <Icon size={15} className="text-primary-500" />
                    {label}
                  </span>
                  <span className="font-medium text-primary-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-primary-800 mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs font-medium bg-primary-50 text-primary-700 rounded-full px-3 py-1.5"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-primary-800 mb-3">Locality Info</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-black/10 p-4 flex items-start gap-2.5">
                <School size={18} className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-black/45">Nearby School</p>
                  <p className="text-sm font-medium text-primary-900">{property.nearby.schools}</p>
                </div>
              </div>
              <div className="rounded-xl border border-black/10 p-4 flex items-start gap-2.5">
                <Hospital size={18} className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-black/45">Nearby Hospital</p>
                  <p className="text-sm font-medium text-primary-900">{property.nearby.hospitals}</p>
                </div>
              </div>
              <div className="rounded-xl border border-black/10 p-4 flex items-start gap-2.5">
                <TrainFront size={18} className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-black/45">Metro / Transit</p>
                  <p className="text-sm font-medium text-primary-900">
                    {property.nearby.metro || "Not available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-black/10 bg-primary-50 h-40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#0f5c5433_1px,transparent_1px),linear-gradient(90deg,#0f5c5433_1px,transparent_1px)] [background-size:20px_20px]" />
              <p className="relative text-xs text-primary-600 font-medium">Static map placeholder</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-black/10 p-5">
            <p className="text-xs text-black/45">Listed by</p>
            <p className="mt-0.5 font-semibold text-primary-900">
              {property.postedBy === "Broker" ? "Verified Broker" : "Property Owner"}
            </p>
            {property.verified && (
              <div className="mt-2">
                <VerifiedBadge withTooltip />
              </div>
            )}
            <button
              onClick={() => setEnquiryOpen(true)}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold py-3 transition-colors"
            >
              <Phone size={16} />
              Contact {property.postedBy}
            </button>
            <p className="mt-3 text-[11px] text-black/40 text-center">
              Your contact details are only shared with this {property.postedBy.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-4 -mx-4 sm:-mx-6">
          <PropertyCarousel properties={similar} title="Similar Properties" />
        </div>
      )}

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} property={property} />
    </div>
  );
}
