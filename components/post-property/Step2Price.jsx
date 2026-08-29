import { Field, inputClass } from "./fields";

export default function Step2Price({ data, update }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-primary-800">Price & Availability</h2>
      <p className="text-sm text-black/50 mt-1">Set the price and when the property is available.</p>

      <div className="mt-6 flex gap-2">
        {["rent", "sale"].map((purpose) => (
          <button
            key={purpose}
            type="button"
            onClick={() => update({ purpose })}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              data.purpose === purpose
                ? "bg-primary-500 border-primary-500 text-white"
                : "border-black/15 text-black/60"
            }`}
          >
            {purpose === "rent" ? "For Rent" : "For Sale"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <Field label={data.purpose === "sale" ? "Sale Price (₹)" : "Monthly Rent (₹)"}>
          <input
            type="number"
            min="0"
            className={inputClass}
            placeholder={data.purpose === "sale" ? "e.g. 5600000" : "e.g. 16500"}
            value={data.price}
            onChange={(e) => update({ price: e.target.value })}
          />
        </Field>

        <Field label="Security Deposit (₹)" hint="Leave blank if not applicable">
          <input
            type="number"
            min="0"
            className={inputClass}
            placeholder="e.g. 50000"
            value={data.deposit}
            onChange={(e) => update({ deposit: e.target.value })}
          />
        </Field>

        <Field label="Available From">
          <input
            type="date"
            className={inputClass}
            value={data.availableFrom}
            onChange={(e) => update({ availableFrom: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}
