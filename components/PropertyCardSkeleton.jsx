// Skeleton placeholder shown briefly while the (mock) listings "load" —
// simulates a real fetch even though the data is static/local.
export default function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border border-black/10 bg-white overflow-hidden animate-pulse" aria-hidden="true">
      <div className="h-44 w-full bg-black/10" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 w-24 rounded bg-black/10" />
        <div className="h-3.5 w-full rounded bg-black/10" />
        <div className="h-3 w-2/3 rounded bg-black/10" />
        <div className="flex gap-3 pt-2 border-t border-black/5">
          <div className="h-3 w-12 rounded bg-black/10" />
          <div className="h-3 w-16 rounded bg-black/10" />
        </div>
      </div>
    </div>
  );
}
