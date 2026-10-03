import { Field, inputClass } from "./fields";
import { FACING_LABELS, FURNISHING_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/propertyLabels";
import { amenityOptionsFor, suggestedTitle } from "@/lib/postProperty";

export default function Step1Basics({ data, update }) {
  const amenities = amenityOptionsFor(data.propertyType);
  const toggleAmenity = (a) =>
    update({
      amenities: data.amenities.includes(a) ? data.amenities.filter((x) => x !== a) : [...data.amenities, a],
    });
  const onDigits = (key) => (e) => update({ [key]: e.target.value.replace(/[^\d]/g, "") });
  const floorTooHigh =
    data.floorNumber !== "" && data.totalFloors !== "" && Number(data.floorNumber) > Number(data.totalFloors);

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
            onChange={(e) => {
              const propertyType = e.target.value;
              // Drop amenities that don't apply to the new kind of property.
              const allowed = amenityOptionsFor(propertyType);
              update({ propertyType, amenities: data.amenities.filter((a) => allowed.includes(a)) });
            }}
          >
            <option value="">Select type</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>

        <Field label="BHK / Rooms" hint="Leave blank for commercial or PG listings">
          <select className={inputClass} value={data.bhk} onChange={(e) => update({ bhk: e.target.value })}>
            <option value="">Not applicable</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} BHK</option>
            ))}
          </select>
        </Field>

        <Field label="Area (sqft)">
          <input
            inputMode="numeric"
            className={inputClass}
            placeholder="e.g. 1050"
            value={data.area}
            onChange={onDigits("area")}
          />
        </Field>

        <Field label="Furnishing">
          <select className={inputClass} value={data.furnishing} onChange={(e) => update({ furnishing: e.target.value })}>
            <option value="">Select</option>
            {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>

        <Field label="Locality" hint="e.g. Vijay Nagar">
          <input
            type="text"
            maxLength={100}
            className={inputClass}
            value={data.locality}
            onChange={(e) => update({ locality: e.target.value })}
          />
        </Field>

        <Field label="City">
          <input
            type="text"
            maxLength={100}
            className={inputClass}
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Full Address" hint="Optional">
            <textarea
              rows={2}
              maxLength={300}
              className={`${inputClass} resize-none`}
              value={data.address}
              onChange={(e) => update({ address: e.target.value })}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Listing Title" hint="Leave blank to use the suggestion">
            <input
              type="text"
              maxLength={150}
              className={inputClass}
              placeholder={suggestedTitle(data) || "e.g. Sunny 2 BHK Apartment in Vijay Nagar"}
              value={data.title}
              onChange={(e) => update({ title: e.target.value })}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              rows={4}
              maxLength={5000}
              className={`${inputClass} resize-none`}
              placeholder="What makes this property a good home or workspace? Nearby landmarks, condition, rules…"
              value={data.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Facing" hint="Optional">
          <select className={inputClass} value={data.facing} onChange={(e) => update({ facing: e.target.value })}>
            <option value="">Not specified</option>
            {Object.entries(FACING_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Floor" hint="0 = ground">
            <input inputMode="numeric" className={inputClass} placeholder="e.g. 3" value={data.floorNumber} onChange={onDigits("floorNumber")} />
          </Field>
          <Field label="Total floors">
            <input inputMode="numeric" className={inputClass} placeholder="e.g. 11" value={data.totalFloors} onChange={onDigits("totalFloors")} />
          </Field>
        </div>
        {floorTooHigh && (
          <p className="sm:col-span-2 -mt-3 text-xs text-red-600">Floor can&apos;t be higher than the total number of floors.</p>
        )}

        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-black/70">Amenities <span className="text-black/40 font-normal">(optional)</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {amenities.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                aria-pressed={data.amenities.includes(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  data.amenities.includes(a)
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "border-black/15 text-black/60 hover:border-black/30"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
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
