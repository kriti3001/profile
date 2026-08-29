export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black/70">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="text-xs text-black/40 mt-1 block">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-black/15 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white";
