import Link from "next/link";
import { localities } from "@/data/localities";

export default function LocalitiesSection() {
  return (
    <section className="bg-black/[0.02] py-14 sm:py-20">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">
              Trending Localities
            </h2>
            <p className="mt-2 text-black/55 text-sm sm:text-base">
              We&apos;re growing city-by-city, starting with India&apos;s Tier-2 hubs.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {localities.map((loc) => (
            <Link
              key={loc.id}
              href={`/rent?city=${encodeURIComponent(loc.city)}`}
              className="group rounded-xl overflow-hidden border border-black/10 bg-white hover:shadow-md transition-all"
            >
              <div
                className="h-20 w-full"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(${loc.hue} 45% 90%), hsl(${loc.hue} 55% 78%))`,
                }}
              />
              <div className="p-3">
                <p className="text-sm font-semibold text-primary-800 group-hover:text-primary-600">
                  {loc.name}
                </p>
                <p className="text-xs text-black/50">{loc.city}</p>
                <p className="mt-1 text-[11px] text-accent-600 font-medium">
                  {loc.listingCount} listings
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
