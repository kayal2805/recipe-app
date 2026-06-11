import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function Navbar() {
  const { count } = useFavorites();

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors hover:text-plum ${
      isActive ? "text-plum" : "text-ink-soft"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-paper-dark bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Pantry home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum">
            <span className="block h-3.5 w-3.5 rounded-full ring-2 ring-saffron" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Pantry
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>
            Browse
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            <span className="inline-flex items-center gap-1.5">
              Favorites
              {count > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-berry px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                  {count}
                </span>
              )}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
