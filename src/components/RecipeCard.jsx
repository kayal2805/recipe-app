import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function RecipeCard({ meal, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(meal.idMeal);

  const handleFav = (e) => {
    // Don't navigate when the heart inside the card link is clicked.
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(meal);
  };

  return (
    <Link
      to={`/recipe/${meal.idMeal}`}
      className="group relative block animate-fade-up overflow-hidden rounded-2xl border border-paper-dark bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleFav}
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-berry shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${favorite ? "animate-pop" : ""}`}
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>

        {meal.strCategory && (
          <span className="absolute bottom-3 left-3 chip bg-plum/90 text-paper backdrop-blur">
            {meal.strCategory}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink line-clamp-2">
          {meal.strMeal}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-ink-soft">
          View recipe
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
