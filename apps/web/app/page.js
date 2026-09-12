import SearchBar from "@/components/SearchBar";
import TrustStrip from "@/components/TrustStrip";
import WhySection from "@/components/WhySection";
import LocalitiesSection from "@/components/LocalitiesSection";
import PropertyCarousel from "@/components/PropertyCarousel";
import Testimonials from "@/components/Testimonials";
import { properties } from "@/data/properties";

export default function Home() {
  const trending = properties.filter((p) => p.category === "rent" && p.verified).slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden bg-primary-900">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(120deg, hsl(172 55% 30%), hsl(20 70% 45%))",
          }}
        />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,_#fff_1px,_transparent_1px)] [background-size:18px_18px]" />

        <div className="relative container-page py-16 sm:py-24 flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 text-white text-xs font-medium px-3 py-1 border border-white/15">
            Now live across 6 Tier-2 cities
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-bold text-white max-w-2xl leading-tight">
            Find a home you can trust,{" "}
            <span className="text-accent-400">without the middleman drama.</span>
          </h1>
          <p className="mt-4 text-white/70 max-w-xl text-sm sm:text-base">
            Verified listings, auto-generated rent agreements, and one
            posting that reaches every major property portal.
          </p>

          <div className="mt-8 w-full flex justify-center">
            <SearchBar defaultCategory="rent" />
          </div>
        </div>
      </section>

      <TrustStrip />
      <WhySection />
      <LocalitiesSection />

      <PropertyCarousel
        properties={trending}
        title="Trending Rentals"
        subtitle="Fresh, verified listings from owners and brokers near you."
      />

      <Testimonials />
    </>
  );
}
