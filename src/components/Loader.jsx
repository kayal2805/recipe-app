// A grid of shimmering placeholder cards shown while recipes load.
export default function Loader({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Loading recipes"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-paper-dark bg-white shadow-card"
        >
          <div className="aspect-[4/3] animate-pulse bg-paper-dark" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-paper-dark" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-paper-dark" />
          </div>
        </div>
      ))}
    </div>
  );
}
