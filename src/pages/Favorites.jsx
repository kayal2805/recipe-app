import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <section className="py-10 sm:py-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-saffron">
          Your collection
        </p>
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">Favorites</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Recipes you've saved live here, stored on this device so they're waiting
          for you next time.
        </p>
      </section>

      {favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Tap the heart on any recipe to save it for later."
          action={
            <Link to="/" className="btn-primary">
              Browse recipes
            </Link>
          }
        />
      ) : (
        <RecipeGrid meals={favorites} />
      )}
    </div>
  );
}
