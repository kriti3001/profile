import { Field, inputClass } from "./fields";

const propertyTypes = ["Apartment", "Independent House", "Villa", "Studio", "PG", "Co-living", "Office Space", "Retail Shop"];
const furnishingOptions = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];

export default function Step1Basics({ data, update }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Property Basics</h2>
      <p className="text-sm text-black/50 mt-1">
        {data.role === "broker"
          ? "Tell us about this listing, plus how many properties you manage overall."
          : "Tell us the basics of your property."}
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <Field label="Property Type">
          <select
            className={inputClass}
            value={data.propertyType}
            onChange={(e) => update({ propertyType: e.target.value })}
          >
            <option value="">Select type</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="BHK / Rooms">
          <select className={inputClass} value={data.bhk} onChange={(e) => update({ bhk: e.target.value })}>
            <option value="">Select</option>
            {[1, 2, 3, 4, "5+"].map((n) => (
              <option key={n} value={n}>{n} {typeof n === "number" ? "BHK" : "BHK"}</option>
            ))}
          </select>
        </Field>

        <Field label="Area (sqft)">
          <input
            type="number"
            min="0"
            className={inputClass}
            placeholder="e.g. 1050"
            value={data.area}
            onChange={(e) => update({ area: e.target.value })}
          />
        </Field>

        <Field label="Furnishing">
          <select className={inputClass} value={data.furnishing} onChange={(e) => update({ furnishing: e.target.value })}>
            <option value="">Select</option>
            {furnishingOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </Field>

        <Field label="Locality" hint="e.g. Vijay Nagar">
          <input
            type="text"
            className={inputClass}
            value={data.locality}
            onChange={(e) => update({ locality: e.target.value })}
          />
        </Field>

        <Field label="City">
          <input
            type="text"
            className={inputClass}
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Full Address">
            <textarea
              rows={2}
              className={`${inputClass} resize-none`}
              value={data.address}
              onChange={(e) => update({ address: e.target.value })}
            />
          </Field>
        </div>

        {data.role === "broker" && (
          <div className="sm:col-span-2 rounded-xl bg-primary-50 border border-primary-100 p-4">
            <Field
              label="How many listings do you manage in total?"
              hint="Helps us recommend the right plan on the Sync Status dashboard."
            >
              <input
                type="number"
                min="1"
                className={inputClass}
                placeholder="e.g. 25"
                value={data.listingCount}
                onChange={(e) => update({ listingCount: e.target.value })}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
