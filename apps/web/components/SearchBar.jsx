"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const propertyTypes = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
  { value: "pg", label: "PG / Co-living" },
  { value: "commercial", label: "Commercial" },
];

const routeFor = {
  rent: "/rent",
  buy: "/buy",
  pg: "/pg-coliving",
  commercial: "/commercial",
};

export default function SearchBar({ defaultCategory = "rent" }) {
  const [category, setCategory] = useState(defaultCategory);
  const [location, setLocation] = useState("");
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    router.push(`${routeFor[category]}${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl bg-white rounded-xl sm:rounded-full shadow-xl p-2 flex flex-col sm:flex-row gap-2"
    >
      <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-1 px-1">
        {propertyTypes.map((t) => (
          <button
            type="button"
            key={t.value}
            onClick={() => setCategory(t.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              category === t.value ? "bg-primary-500 text-white" : "bg-black/5 text-black/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Property type"
        className="hidden sm:block rounded-full px-4 py-3 text-sm font-medium text-primary-700 bg-primary-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary-400 shrink-0"
      >
        {propertyTypes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <div className="flex items-center flex-1 gap-2 px-3 py-2 sm:py-0">
        <MapPin size={18} className="text-black/35 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search locality or city — e.g. Indore, Vijay Nagar"
          aria-label="Search locality or city"
          className="w-full text-sm focus:outline-none placeholder:text-black/35"
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 rounded-full bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm px-6 py-3 transition-colors"
      >
        <Search size={16} />
        Search
      </button>
    </form>
  );
}
