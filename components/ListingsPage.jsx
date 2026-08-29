"use client";

import { useEffect, useMemo, useState } from "react";
import { List, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { properties as allProperties } from "@/data/properties";
import PropertyCard from "./PropertyCard";
import FilterSidebar from "./FilterSidebar";
import CityTrendWidget from "./trends/CityTrendWidget";
import { trendCities } from "@/data/trends";

const PAGE_SIZE = 6;

const sortFns = {
  relevant: (a, b) => Number(b.verified) - Number(a.verified),
  priceLow: (a, b) => a.price - b.price,
  priceHigh: (a, b) => b.price - a.price,
  newest: (a, b) => new Date(b.availableFrom) - new Date(a.availableFrom),
};

export default function ListingsPage({ category, title, subtitle }) {
  // Read ?q= / ?city= directly from the URL on mount instead of
  // next/navigation's useSearchParams(). useSearchParams() forces this
  // component behind a Suspense boundary, and since this site is a fully
  // static export (no server to stream from), the build bakes the Suspense
  // *fallback* into the static HTML instead of the real content — the page
  // looked empty until client JS finished hydrating. Reading location.search
  // in an effect keeps the full page in the static HTML immediately, and
  // just narrows the results once the client mounts.
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevant");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMax: null,
    bhk: [],
    furnishing: [],
    type: [],
    verifiedOnly: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || params.get("city") || "";
    // Reading the URL (an external system) once on mount, not derived from
    // props/state — same justified case as AuthContext's session restore.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q);
  }, []);

  const categoryProperties = useMemo(
    () => allProperties.filter((p) => p.category === category),
    [category]
  );

  const propertyTypes = useMemo(
    () => Array.from(new Set(categoryProperties.map((p) => p.type))),
    [categoryProperties]
  );

  const filtered = useMemo(() => {
    let list = categoryProperties;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.city.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      );
    }
    if (filters.priceMax) list = list.filter((p) => p.price <= filters.priceMax);
    if (filters.bhk.length) list = list.filter((p) => filters.bhk.includes(p.bhk));
    if (filters.furnishing.length)
      list = list.filter((p) => filters.furnishing.includes(p.furnishing));
    if (filters.type.length) list = list.filter((p) => filters.type.includes(p.type));
    if (filters.verifiedOnly) list = list.filter((p) => p.verified);

    return [...list].sort(sortFns[sort]);
  }, [categoryProperties, query, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const matchedCity = trendCities.find((c) => c.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="bg-black/[0.015] min-h-[70vh]">
      <div className="bg-white border-b border-black/10">
        <div className="container-page py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-800">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-black/55">{subtitle}</p>}
          <div className="mt-4">
            <div className="flex items-center gap-2 bg-black/5 rounded-full px-4 py-2.5 max-w-xl">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search locality or city"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-6 flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} propertyTypes={propertyTypes} />
        </div>

        <div className="flex-1 min-w-0">
          {matchedCity && (
            <div className="mb-4">
              <CityTrendWidget city={matchedCity} />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-black/55">
              <span className="font-semibold text-primary-800">{filtered.length}</span> properties found
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-black/15 rounded-lg px-3 py-1.5"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-black/15 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="relevant">Most Relevant</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>

              <div className="flex items-center rounded-lg border border-black/15 overflow-hidden text-sm">
                <button
                  onClick={() => setView("list")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 ${
                    view === "list" ? "bg-primary-500 text-white" : "text-black/60"
                  }`}
                >
                  <List size={14} /> List
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 ${
                    view === "map" ? "bg-primary-500 text-white" : "text-black/60"
                  }`}
                >
                  <MapIcon size={14} /> Map
                </button>
              </div>
            </div>
          </div>

          {view === "map" ? (
            <div className="mt-5 rounded-xl border border-black/10 bg-primary-50 h-[420px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#0f5c5433_1px,transparent_1px),linear-gradient(90deg,#0f5c5433_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="relative text-center px-6">
                <MapIcon size={32} className="mx-auto text-primary-400" />
                <p className="mt-2 text-sm text-primary-700 font-medium">
                  Map view is a static placeholder in this prototype
                </p>
                <p className="text-xs text-primary-500 mt-1">
                  {filtered.length} pins would appear here in a live map integration
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paged.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              {paged.length === 0 && (
                <div className="py-16 text-center text-sm text-black/50">
                  No properties match your filters. Try adjusting them.
                </div>
              )}
            </>
          )}

          {view === "list" && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    page === n
                      ? "bg-primary-500 text-white"
                      : "border border-black/15 text-black/60 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-primary-800">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} propertyTypes={propertyTypes} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-primary-500 text-white text-sm font-semibold py-2.5"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
