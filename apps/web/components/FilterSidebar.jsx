"use client";

import {
  AMENITIES_BY_CATEGORY,
  FACING_LABELS,
  FURNISHING_LABELS,
  PROPERTY_TYPE_LABELS,
  TYPES_BY_CATEGORY,
} from "@/lib/propertyLabels";
import { emptyFilters } from "@/lib/listingFilters";

const bhkOptions = [1, 2, 3, 4];

export default function FilterSidebar({ filters, setFilters, category }) {
  const toggleArrayValue = (key, value) => {
    setFilters((f) => {
      const set = new Set(f[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  };
  const setField = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value.replace(/[^\d]/g, "") }));

  const types = TYPES_BY_CATEGORY[category] ?? [];
  const amenities = AMENITIES_BY_CATEGORY[category] ?? [];
  const showBhk = category === "rent" || category === "buy";

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary-800">Filters</h3>
        <button
          onClick={() => setFilters(emptyFilters)}
          className="text-xs text-accent-600 font-medium hover:underline"
        >
          Clear all
        </button>
      </div>

      <RangeInputs
        label={category === "buy" ? "Price (₹)" : "Monthly Price (₹)"}
        min={filters.minPrice}
        max={filters.maxPrice}
        onMin={setField("minPrice")}
        onMax={setField("maxPrice")}
      />

      {showBhk && (
        <div>
          <p className="text-sm font-medium text-black/70 mb-2">BHK</p>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((n) => (
              <button
                key={n}
                onClick={() => toggleArrayValue("bhk", n)}
                aria-pressed={filters.bhk.includes(n)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  filters.bhk.includes(n)
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "border-black/15 text-black/60"
                }`}
              >
                {n === 4 ? "4+ BHK" : `${n} BHK`}
              </button>
            ))}
          </div>
        </div>
      )}

      <CheckboxGroup
        title="Furnishing"
        options={Object.entries(FURNISHING_LABELS)}
        selected={filters.furnishing}
        onToggle={(v) => toggleArrayValue("furnishing", v)}
      />

      {types.length > 1 && (
        <CheckboxGroup
          title="Property Type"
          options={types.map((t) => [t, PROPERTY_TYPE_LABELS[t]])}
          selected={filters.type}
          onToggle={(v) => toggleArrayValue("type", v)}
        />
      )}

      <RangeInputs
        label="Area (sqft)"
        min={filters.minArea}
        max={filters.maxArea}
        onMin={setField("minArea")}
        onMax={setField("maxArea")}
      />

      <CheckboxGroup
        title="Amenities"
        hint="Listings must have all selected"
        collapsible
        options={amenities.map((a) => [a, a])}
        selected={filters.amenities}
        onToggle={(v) => toggleArrayValue("amenities", v)}
      />

      <CheckboxGroup
        title="Facing"
        collapsible
        options={Object.entries(FACING_LABELS)}
        selected={filters.facing}
        onToggle={(v) => toggleArrayValue("facing", v)}
      />

      <div className="flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2.5">
        <span className="text-sm font-medium text-primary-800">Verified only</span>
        <button
          onClick={() => setFilters((f) => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
          role="switch"
          aria-checked={filters.verifiedOnly}
          aria-label="Show verified listings only"
          className={`relative w-10 h-6 rounded-full transition-colors ${
            filters.verifiedOnly ? "bg-primary-500" : "bg-black/20"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              filters.verifiedOnly ? "translate-x-4" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
}

function RangeInputs({ label, min, max, onMin, onMax }) {
  const cls =
    "w-full rounded-lg border border-black/15 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400";
  return (
    <div>
      <p className="text-sm font-medium text-black/70 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <input inputMode="numeric" placeholder="Min" aria-label={`Minimum ${label}`} value={min} onChange={onMin} className={cls} />
        <span className="text-black/30">–</span>
        <input inputMode="numeric" placeholder="Max" aria-label={`Maximum ${label}`} value={max} onChange={onMax} className={cls} />
      </div>
    </div>
  );
}

function CheckboxGroup({ title, hint, options, selected, onToggle, collapsible = false }) {
  const list = (
    <div className="space-y-1.5">
      {options.map(([value, label]) => (
        <label key={value} className="flex items-center gap-2 text-sm text-black/65">
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => onToggle(value)}
            className="accent-primary-500"
          />
          {label}
        </label>
      ))}
    </div>
  );

  if (!collapsible) {
    return (
      <div>
        <p className="text-sm font-medium text-black/70 mb-2">{title}</p>
        {list}
      </div>
    );
  }
  return (
    <details open={selected.length > 0} className="group">
      <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-medium text-black/70">
        <span>
          {title}
          {selected.length > 0 && (
            <span className="ml-1.5 text-[11px] font-semibold bg-primary-50 text-primary-700 rounded-full px-1.5 py-0.5">
              {selected.length}
            </span>
          )}
        </span>
        <span className="text-black/35 group-open:rotate-180 transition-transform">▾</span>
      </summary>
      {hint && <p className="text-[11px] text-black/40 mt-1">{hint}</p>}
      <div className="mt-2">{list}</div>
    </details>
  );
}
