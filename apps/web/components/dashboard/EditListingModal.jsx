"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { FURNISHING_LABELS } from "@/lib/propertyLabels";
import { Field, inputClass } from "../post-property/fields";

// Edits a listing's main details with PATCH /properties/:id. `property` is a view property.
export default function EditListingModal({ property, onClose, onSaved }) {
  const { getAccessToken } = useAuth();
  const isSale = property.category === "buy";
  const [form, setForm] = useState({
    title: property.title,
    description: property.description,
    price: String(property.price),
    deposit: property.deposit == null ? "" : String(property.deposit),
    availableFrom: property.availableFrom.slice(0, 10),
    furnishingStatus: property.furnishingStatus,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const updated = await apiFetch(`/properties/${property.id}`, {
        method: "PATCH",
        token,
        body: {
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          ...(isSale ? {} : { deposit: form.deposit === "" ? null : Number(form.deposit) }),
          availableFrom: form.availableFrom,
          furnishingStatus: form.furnishingStatus,
        },
      });
      onSaved(updated);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={save}
        role="dialog"
        aria-modal="true"
        aria-label="Edit listing"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-6 space-y-4"
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-black/70" aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-primary-700">Edit listing</h2>

        <Field label="Title">
          <input required maxLength={150} className={inputClass} value={form.title} onChange={set("title")} />
        </Field>
        <Field label="Description">
          <textarea required rows={4} maxLength={5000} className={`${inputClass} resize-none`} value={form.description} onChange={set("description")} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={isSale ? "Sale Price (₹)" : "Monthly Rent (₹)"}>
            <input required type="number" min="1" className={inputClass} value={form.price} onChange={set("price")} />
          </Field>
          {!isSale && (
            <Field label="Deposit (₹)" hint="Blank = none">
              <input type="number" min="0" className={inputClass} value={form.deposit} onChange={set("deposit")} />
            </Field>
          )}
          <Field label="Available From">
            <input required type="date" className={inputClass} value={form.availableFrom} onChange={set("availableFrom")} />
          </Field>
          <Field label="Furnishing">
            <select className={inputClass} value={form.furnishingStatus} onChange={set("furnishingStatus")}>
              {Object.entries(FURNISHING_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-black/15 text-sm font-medium px-4 py-2 hover:bg-black/5">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
