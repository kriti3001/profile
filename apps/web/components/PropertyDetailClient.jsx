"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BedDouble,
  CalendarDays,
  Compass,
  Layers,
  MapPin,
  MessageCircle,
  Ruler,
  SearchX,
  Sofa,
  Wallet,
} from "lucide-react";
import PropertyImage from "./PropertyImage";
import VerifiedBadge from "./VerifiedBadge";
import EnquiryModal from "./EnquiryModal";
import PropertyCarousel from "./PropertyCarousel";
import { apiFetch } from "@/lib/api";
import { formatDate, formatINR, formatPrice } from "@/lib/format";
import { toViewProperty } from "@/lib/propertyLabels";

const listingRoute = { rent: "/rent", buy: "/buy", pg: "/pg-coliving", commercial: "/commercial" };

// Detail page for /property/?id=<uuid>; everything is fetched in the browser (static export).
export default function PropertyDetailClient() {
  // { status: "loading" | "ready" | "missing" | "error", property?, message? }
  const [state, setState] = useState({ status: "loading" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      // The URL is an external input read once; no request to make.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "missing" });
      return;
    }
    const controller = new AbortController();
    apiFetch(`/properties/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((p) => {
        const property = toViewProperty(p);
        document.title = `${property.title} | BharosaGhar`;
        setState({ status: "ready", property });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        // 404 = no such listing (or not public); 400 = malformed id. Both mean "not found" to a visitor.
        if (err.status === 404 || err.status === 400) setState({ status: "missing" });
        else setState({ status: "error", message: err.message });
      });
    return () => controller.abort();
  }, [retry]);

  if (state.status === "loading") return <DetailSkeleton />;
  if (state.status === "missing") {
    return (
      <div className="container-page py-24 text-center">
        <SearchX size={36} className="mx-auto text-black/30" />
        <h1 className="mt-3 text-xl font-semibold text-primary-800">Property not found</h1>
        <p className="mt-1.5 text-sm text-black/55">
          This listing doesn&apos;t exist, or it&apos;s no longer publicly available.
        </p>
        <Link href="/rent" className="mt-6 inline-block rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5">
          Browse rentals
        </Link>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="container-page py-24 text-center" role="alert">
        <AlertCircle size={36} className="mx-auto text-red-500" />
        <h1 className="mt-3 text-xl font-semibold text-primary-800">Couldn&apos;t load this property</h1>
        <p className="mt-1.5 text-sm text-black/55">{state.message}</p>
        <button
          onClick={() => {
            setState({ status: "loading" });
            setRetry((n) => n + 1);
          }}
          className="mt-6 rounded-lg border border-black/15 text-sm font-medium px-5 py-2.5 hover:bg-black/5"
        >
          Try again
        </button>
      </div>
    );
  }
  return <PropertyDetail property={state.property} />;
}

function PropertyDetail({ property }) {
  const [activeImage, setActiveImage] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [similar, setSimilar] = useState([]);
  const rented = property.status === "RENTED";

  // Similar = same category in the same city, newest first.
  useEffect(() => {
    const controller = new AbortController();
    apiFetch("/properties", {
      query: { category: property.category.toUpperCase(), city: property.city, limit: 5 },
      signal: controller.signal,
    })
      .then((res) => setSimilar(res.data.filter((p) => p.id !== property.id).slice(0, 4).map(toViewProperty)))
      .catch(() => {}); // optional section: just don't show it
    return () => controller.abort();
  }, [property.id, property.category, property.city]);

  const photos = property.photoUrls;
  const details = [
    { icon: Wallet, label: property.category === "buy" ? "Price" : "Rent", value: formatPrice(property.price, property.category) },
    property.deposit != null && { icon: Wallet, label: "Deposit", value: `₹${formatINR(property.deposit)}` },
    property.bhk && { icon: BedDouble, label: "BHK", value: `${property.bhk} BHK` },
    { icon: Ruler, label: "Area", value: `${property.area} sqft` },
    { icon: Sofa, label: "Furnishing", value: property.furnishing },
    property.floor && { icon: Layers, label: "Floor", value: property.floor },
    property.facingLabel && { icon: Compass, label: "Facing", value: property.facingLabel },
    { icon: CalendarDays, label: "Available From", value: formatDate(property.availableFrom) },
  ].filter(Boolean);

  return (
    <div className="container-page py-8">
      <nav className="text-xs text-black/45 mb-4" aria-label="Breadcrumb">
        <Link href={listingRoute[property.category]} className="capitalize hover:text-primary-600">
          {property.category === "pg" ? "PG / Co-living" : property.category}
        </Link>{" "}
        / {property.city} / {property.locality}
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyImage
            src={photos[activeImage]}
            seed={property.id}
            label={property.title}
            alt={`${property.title}, photo ${activeImage + 1}`}
            className="h-72 sm:h-96 w-full rounded-2xl"
            iconSize={30}
          />
          {photos.length > 1 && (
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
              {photos.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View photo ${i + 1} of ${photos.length}`}
                  aria-current={activeImage === i}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-primary-500" : "border-transparent"
                  }`}
                >
                  <PropertyImage src={url} seed={`${property.id}-${i}`} className="h-16 sm:h-20 w-full" iconSize={14} />
                </button>
              ))}
            </div>
          )}

          {rented && (
            <div className="mt-6 rounded-xl bg-black/5 px-4 py-3 text-sm text-black/65">
              This property has been rented and is no longer available.
            </div>
          )}

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

          <p className="mt-4 text-sm text-black/65 leading-relaxed max-w-2xl whitespace-pre-line">{property.description}</p>

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

          {property.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-primary-800 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a} className="text-xs font-medium bg-primary-50 text-primary-700 rounded-full px-3 py-1.5">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-black/10 p-5">
            <p className="text-xs text-black/45">Interested in this property?</p>
            <p className="mt-0.5 font-semibold text-primary-900">Send an enquiry to the lister</p>
            {property.verified && (
              <div className="mt-2">
                <VerifiedBadge withTooltip />
              </div>
            )}
            <button
              onClick={() => setEnquiryOpen(true)}
              disabled={rented}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-accent-500 hover:bg-accent-600 disabled:bg-black/20 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 transition-colors"
            >
              <MessageCircle size={16} />
              {rented ? "No longer available" : "Send Enquiry"}
            </button>
            <p className="mt-3 text-[11px] text-black/40 text-center">
              No account needed. Your contact details are only shared with this lister.
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-4 -mx-4 sm:-mx-6">
          <PropertyCarousel properties={similar} title={`More in ${property.city}`} />
        </div>
      )}

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} property={property} />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-page py-8 animate-pulse" aria-busy="true" aria-label="Loading property">
      <div className="h-3 w-48 rounded bg-black/10 mb-4" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-72 sm:h-96 w-full rounded-2xl bg-black/10" />
          <div className="h-6 w-2/3 rounded bg-black/10" />
          <div className="h-4 w-1/3 rounded bg-black/10" />
          <div className="h-24 w-full rounded bg-black/10" />
        </div>
        <div className="h-48 rounded-2xl bg-black/10" />
      </div>
    </div>
  );
}
