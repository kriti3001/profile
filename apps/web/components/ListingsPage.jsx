"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight, List, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import FilterSidebar from "./FilterSidebar";
import { emptyFilters, filtersToQuery } from "@/lib/listingFilters";
import CityTrendWidget from "./trends/CityTrendWidget";
import { trendCities } from "@/data/trends";
import { apiFetch } from "@/lib/api";
import { CATEGORY_TO_API, toViewProperty } from "@/lib/propertyLabels";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

const PAGE_SIZE = 12;

const categoryLabels = {
  rent: "Rent",
  buy: "Buy",
  pg: "PG / Co-living",
  commercial: "Commercial",
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ListingsPage({ category, title, subtitle }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFiltersState] = useState(emptyFilters);
  const [retry, setRetry] = useState(0);
  // Result of the last finished request, tagged with the request it answers.
  const [result, setResult] = useState({ key: null, data: [], total: 0, totalPages: 0, error: null });

  // Any filter change goes back to page 1.
  const setFilters = (update) => {
    setFiltersState(update);
    setPage(1);
  };

  useEffect(() => {
    // Read ?q= (homepage search) and ?city= (Trending Localities links) directly from the URL on mount
    // instead of next/navigation's useSearchParams(). useSearchParams() forces this component behind a
    // Suspense boundary, and in a fully static export the build bakes the Suspense *fallback* into the
    // HTML, so the page looked empty until client JS hydrated. The URL is an external system read once,
    // not state derived from props.
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    setQuery(params.get("q") ?? "");
    setCity(params.get("city") ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Typing and number inputs settle before a request goes out.
  const debouncedQuery = useDebouncedValue(query.trim(), 350);
  const debouncedFilters = useDebouncedValue(filters, 350);

  const requestQuery = useMemo(
    () => ({
      category: CATEGORY_TO_API[category],
      q: debouncedQuery || undefined,
      city: city || undefined,
      ...filtersToQuery(debouncedFilters),
      sortBy: sort,
      page,
      limit: PAGE_SIZE,
    }),
    [category, debouncedQuery, city, debouncedFilters, sort, page],
  );
  const requestKey = `${JSON.stringify(requestQuery)}#${retry}`;

  useEffect(() => {
    const controller = new AbortController();
    apiFetch("/properties", { query: requestQuery, signal: controller.signal })
      .then((res) =>
        setResult({
          key: requestKey,
          data: res.data.map(toViewProperty),
          total: res.total,
          totalPages: res.totalPages,
          error: null,
        }),
      )
      .catch((err) => {
        if (err.name === "AbortError") return;
        setResult({ key: requestKey, data: [], total: 0, totalPages: 0, error: err.message });
      });
    return () => controller.abort();
  }, [requestQuery, requestKey]);

  const loading = result.key !== requestKey;
  const { data: listings, total, totalPages, error } = result;
  const matchedCity = trendCities.find((c) => c.toLowerCase() === (city || debouncedQuery).toLowerCase());

  return (
    <div className="bg-black/[0.015] min-h-[70vh]">
      <div className="bg-white border-b border-black/10">
        <div className="container-page py-6">
          <nav className="text-xs text-black/45 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            {" / "}
            {matchedCity ? (
              <>
                <Link href={`/${category === "pg" ? "pg-coliving" : category}`} className="hover:text-primary-600">
                  {categoryLabels[category]}
                </Link>
                {" / "}
                <span className="text-black/60">{matchedCity}</span>
              </>
            ) : (
              <span className="text-black/60">{categoryLabels[category]}</span>
            )}
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-primary-800">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-black/55">{subtitle}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-black/5 rounded-full px-4 py-2.5 w-full max-w-xl">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search locality, city or keywords"
                aria-label="Search locality, city or keywords"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            {city && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium pl-3 pr-1.5 py-1.5">
                City: {city}
                <button
                  onClick={() => {
                    setCity("");
                    setPage(1);
                  }}
                  aria-label={`Remove city filter ${city}`}
                  className="rounded-full p-0.5 hover:bg-primary-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-page py-6 flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} category={category} />
        </div>

        <div className="flex-1 min-w-0">
          {matchedCity && (
            <div className="mb-4">
              <CityTrendWidget city={matchedCity} />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-black/55" aria-live="polite">
              {loading ? (
                "Searching…"
              ) : error ? (
                " "
              ) : (
                <>
                  <span className="font-semibold text-primary-800">{total}</span>{" "}
                  {total === 1 ? "property" : "properties"} found
                </>
              )}
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-black/15 rounded-lg px-3 py-1.5"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                aria-label="Sort properties"
                className="text-sm border border-black/15 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center rounded-lg border border-black/15 overflow-hidden text-sm">
                <button
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={`flex items-center gap-1 px-2.5 py-1.5 ${
                    view === "list" ? "bg-primary-500 text-white" : "text-black/60"
                  }`}
                >
                  <List size={14} /> List
                </button>
                <button
                  onClick={() => setView("map")}
                  aria-pressed={view === "map"}
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
                  {total} pins would appear here in a live map integration
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
              <AlertCircle size={28} className="mx-auto text-red-500" />
              <p className="mt-2 text-sm font-medium text-red-700">Couldn&apos;t load properties</p>
              <p className="mt-1 text-xs text-red-600/80">{error}</p>
              <button
                onClick={() => setRetry((n) => n + 1)}
                className="mt-4 rounded-lg bg-white border border-red-200 text-red-700 text-sm font-medium px-4 py-1.5 hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-black/15 bg-white py-16 text-center">
              <p className="text-sm font-medium text-primary-800">No properties found</p>
              <p className="mt-1 text-sm text-black/50">
                {page > 1 ? "There are no more results on this page." : "Try removing a filter or searching a different area."}
              </p>
              {page > 1 ? (
                <button onClick={() => setPage(1)} className="mt-4 text-sm font-medium text-primary-600 hover:underline">
                  Back to page 1
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFilters(emptyFilters);
                    setQuery("");
                    setCity("");
                  }}
                  className="mt-4 text-sm font-medium text-primary-600 hover:underline"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}

          {view === "list" && !loading && !error && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-primary-800">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} category={category} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-lg bg-primary-500 text-white text-sm font-semibold py-2.5"
            >
              {loading ? "Show results" : `Show ${total} result${total === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Prev / page numbers (a window around the current page, plus first and last) / Next. */
function Pagination({ page, totalPages, onChange }) {
  const pages = new Set([1, totalPages]);
  for (let n = Math.max(1, page - 2); n <= Math.min(totalPages, page + 2); n++) pages.add(n);
  const sorted = [...pages].sort((a, b) => a - b);
  const go = (n) => {
    onChange(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const btn = "h-8 min-w-8 px-2 rounded-lg text-sm font-medium";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5 flex-wrap" aria-label="Pagination">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btn} border border-black/15 text-black/60 hover:bg-black/5 disabled:opacity-30`}
      >
        <ChevronLeft size={16} />
      </button>
      {sorted.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - sorted[i - 1] > 1 && <span className="text-black/30">…</span>}
          <button
            onClick={() => go(n)}
            aria-current={page === n ? "page" : undefined}
            className={`${btn} ${page === n ? "bg-primary-500 text-white" : "border border-black/15 text-black/60 hover:bg-black/5"}`}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${btn} border border-black/15 text-black/60 hover:bg-black/5 disabled:opacity-30`}
      >
        <ChevronRight size={16} />
      </button>
      <span className="w-full text-center text-xs text-black/40 mt-1">
        Page {page} of {totalPages}
      </span>
    </nav>
  );
}
