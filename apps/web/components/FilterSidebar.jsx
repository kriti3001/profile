"use client";

const furnishingOptions = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const bhkOptions = [1, 2, 3, 4];

export default function FilterSidebar({ filters, setFilters, propertyTypes }) {
  const toggleArrayValue = (key, value) => {
    setFilters((f) => {
      const set = new Set(f[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary-800">Filters</h3>
        <button
          onClick={() =>
            setFilters({
              priceMax: null,
              bhk: [],
              furnishing: [],
              type: [],
              verifiedOnly: false,
            })
          }
          className="text-xs text-accent-600 font-medium hover:underline"
        >
          Clear all
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-black/70 mb-2">Max Price</p>
        <input
          type="range"
          min="5000"
          max="20000000"
          step="5000"
          value={filters.priceMax ?? 20000000}
          onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
          className="w-full accent-primary-500"
        />
        <p className="text-xs text-black/50 mt-1">
          Up to ₹{Number(filters.priceMax ?? 20000000).toLocaleString("en-IN")}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-black/70 mb-2">BHK</p>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((n) => (
            <button
              key={n}
              onClick={() => toggleArrayValue("bhk", n)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                filters.bhk.includes(n)
                  ? "bg-primary-500 border-primary-500 text-white"
                  : "border-black/15 text-black/60"
              }`}
            >
              {n} BHK
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-black/70 mb-2">Furnishing</p>
        <div className="space-y-1.5">
          {furnishingOptions.map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm text-black/65">
              <input
                type="checkbox"
                checked={filters.furnishing.includes(f)}
                onChange={() => toggleArrayValue("furnishing", f)}
                className="accent-primary-500"
              />
              {f}
            </label>
          ))}
        </div>
      </div>

      {propertyTypes?.length > 1 && (
        <div>
          <p className="text-sm font-medium text-black/70 mb-2">Property Type</p>
          <div className="space-y-1.5">
            {propertyTypes.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm text-black/65">
                <input
                  type="checkbox"
                  checked={filters.type.includes(t)}
                  onChange={() => toggleArrayValue("type", t)}
                  className="accent-primary-500"
                />
                {t}
              </label>
            ))}
          </div>
        </div>
      )}

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
