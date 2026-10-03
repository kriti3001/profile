"use client";

import { useEffect, useState } from "react";
import PropertyCarousel from "./PropertyCarousel";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import { apiFetch } from "@/lib/api";
import { toViewProperty } from "@/lib/propertyLabels";

const query = { category: "RENT", sortBy: "newest", limit: 8 };

// Homepage carousel: the newest verified rentals, or the newest rentals if none are verified yet.
// Fetched in the browser (static export). Hidden if there's nothing to show or the API is unreachable.
export default function TrendingListings({ title, subtitle }) {
  const [state, setState] = useState({ status: "loading", properties: [] });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const verified = await apiFetch("/properties", { query: { ...query, verified: true }, signal: controller.signal });
      const res = verified.total > 0 ? verified : await apiFetch("/properties", { query, signal: controller.signal });
      setState({ status: "done", properties: res.data.map(toViewProperty) });
    };
    load().catch((err) => {
      if (err.name !== "AbortError") setState({ status: "done", properties: [] });
    });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return (
      <section className="container-page py-14 sm:py-20" aria-busy="true">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-800">{title}</h2>
        <div className="mt-8 flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="min-w-[270px] max-w-[270px]">
              <PropertyCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (state.properties.length === 0) return null;
  return <PropertyCarousel properties={state.properties} title={title} subtitle={subtitle} />;
}
