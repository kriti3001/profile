"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "./PropertyCard";

export default function PropertyCarousel({ properties, title, subtitle }) {
  const scrollerRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="container-page py-14 sm:py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">{title}</h2>
          {subtitle && <p className="mt-2 text-black/55 text-sm sm:text-base">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center text-black/50 hover:bg-black/5"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full border border-black/15 flex items-center justify-center text-black/50 hover:bg-black/5"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
      >
        {properties.map((p) => (
          <div key={p.id} className="min-w-[270px] max-w-[270px] snap-start">
            <PropertyCard property={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
