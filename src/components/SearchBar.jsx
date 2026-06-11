// Controlled search input. Parent owns the value; this just renders + reports changes.
export default function SearchBar({ value, onChange, placeholder = "Search recipes by name…" }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search recipes by name"
        className="w-full rounded-2xl border border-paper-dark bg-white py-3.5 pl-12 pr-4 text-base text-ink shadow-sm placeholder:text-ink-soft/60 focus:border-plum focus:outline-none focus:ring-2 focus:ring-saffron/40"
      />
    </div>
  );
}
