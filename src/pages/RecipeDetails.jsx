import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMealById, parseIngredients } from "../api/mealApi.js";
import { useFavorites } from "../context/FavoritesContext.jsx";

// Pull the YouTube video id out of any standard watch/share URL.
function youTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    window.scrollTo({ top: 0 });

    getMealById(id)
      .then((data) => {
        if (!alive) return;
        if (!data) {
          setStatus("error");
          return;
        }
        setMeal(data);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));

    return () => {
      alive = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="aspect-[16/9] w-full animate-pulse rounded-3xl bg-paper-dark" />
        <div className="mt-8 h-8 w-2/3 animate-pulse rounded bg-paper-dark" />
        <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-paper-dark" />
      </div>
    );
  }

  if (status === "error" || !meal) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Recipe not found</h1>
        <p className="mt-2 text-ink-soft">This recipe may have been removed or the link is wrong.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to recipes
        </Link>
      </div>
    );
  }

  const ingredients = parseIngredients(meal);
  const favorite = isFavorite(meal.idMeal);
  const videoId = youTubeId(meal.strYoutube);
  const tags = (meal.strTags || "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-plum"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back to recipes
      </button>

      {/* Hero */}
      <header className="mt-4 grid gap-6 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-3xl border border-paper-dark shadow-card">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {meal.strCategory && (
              <span className="chip bg-plum text-paper">{meal.strCategory}</span>
            )}
            {meal.strArea && (
              <span className="chip bg-sage/15 text-sage">{meal.strArea}</span>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {meal.strMeal}
          </h1>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="chip bg-paper-dark text-ink-soft">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toggleFavorite(meal)}
              aria-pressed={favorite}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                favorite
                  ? "bg-berry text-white hover:brightness-110"
                  : "border border-paper-dark bg-white text-ink hover:border-berry hover:text-berry"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill={favorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              {favorite ? "Saved to favorites" : "Save to favorites"}
            </button>

            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-paper-dark bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-plum hover:text-plum"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8zM10 15V9l5 3-5 3z" />
                </svg>
                Watch video
              </a>
            )}

            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-paper-dark bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-plum hover:text-plum"
              >
                Source
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Body: ingredients + instructions */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr]">
        {/* Ingredients */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-xl font-semibold text-ink">Ingredients</h2>
          <p className="mt-1 font-mono text-xs text-ink-soft">{ingredients.length} items</p>

          <ul className="mt-4 space-y-2">
            {ingredients.map((ing, i) => (
              <li
                key={`${ing.name}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-paper-dark bg-white p-2.5"
              >
                <img
                  src={ing.thumb}
                  alt=""
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-lg bg-paper object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{ing.name}</p>
                  {ing.measure && (
                    <p className="truncate font-mono text-xs text-ink-soft">{ing.measure}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Instructions */}
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Instructions</h2>
          <div className="mt-4 space-y-4">
            {meal.strInstructions
              .split(/\r?\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
          </div>

          {videoId && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink">Video guide</h2>
              <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-paper-dark shadow-card">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`${meal.strMeal} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
