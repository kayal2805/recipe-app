import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchRecipes, getRandomMeal } from "../api/mealApi.js";
import useDebounce from "../hooks/useDebounce.js";
import SearchBar from "../components/SearchBar.jsx";
import Filters from "../components/Filters.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ type: "", value: "" });
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const debouncedSearch = useDebounce(search, 450);

  // Build the param object the API helper expects from our single filter state.
  const params = useMemo(
    () => ({
      search: debouncedSearch,
      category: filter.type === "category" ? filter.value : "",
      area: filter.type === "area" ? filter.value : "",
      ingredient: filter.type === "ingredient" ? filter.value : "",
    }),
    [debouncedSearch, filter]
  );

  useEffect(() => {
    let alive = true;
    setStatus("loading");

    fetchRecipes(params)
      .then((data) => {
        if (!alive) return;
        setMeals(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!alive) return;
        setStatus("error");
      });

    return () => {
      alive = false;
    };
  }, [params]);

  const clearAll = useCallback(() => {
    setSearch("");
    setFilter({ type: "", value: "" });
  }, []);

  const surpriseMe = useCallback(async () => {
    try {
      const meal = await getRandomMeal();
      if (meal) navigate(`/recipe/${meal.idMeal}`);
    } catch {
      /* ignore — button is best-effort */
    }
  }, [navigate]);

  const hasFilters = Boolean(search || filter.value);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* Hero */}
      <section className="py-10 sm:py-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-saffron">
          Cook something good
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
          Find a recipe for whatever's in your{" "}
          <span className="text-plum">pantry</span>.
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink-soft sm:text-lg">
          Search thousands of dishes by name, then narrow them down by category,
          cuisine, or the one ingredient you need to use up.
        </p>
      </section>

      {/* Search + filter controls */}
      <section className="sticky top-[61px] z-30 -mx-4 mb-8 space-y-4 border-y border-paper-dark bg-paper/85 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <button type="button" onClick={surpriseMe} className="btn-primary shrink-0">
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
              <path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" />
            </svg>
            Surprise me
          </button>
        </div>

        <Filters filter={filter} onChange={setFilter} />

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {filter.value && (
              <span className="chip bg-saffron-soft text-plum-deep">
                {filter.type}: {filter.value}
                <button
                  type="button"
                  onClick={() => setFilter({ type: "", value: "" })}
                  className="ml-0.5 text-plum/70 hover:text-plum"
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              </span>
            )}
            {search && (
              <span className="chip bg-saffron-soft text-plum-deep">
                search: {search}
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="ml-0.5 text-plum/70 hover:text-plum"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-ink-soft underline-offset-2 hover:text-plum hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* Results */}
      <section>
        {status === "ready" && meals.length > 0 && (
          <p className="mb-5 font-mono text-xs text-ink-soft">
            {meals.length} {meals.length === 1 ? "recipe" : "recipes"}
          </p>
        )}

        {status === "loading" && <Loader />}

        {status === "error" && (
          <EmptyState
            title="Something went wrong"
            message="We couldn't reach the recipe service. Check your connection and try again."
            action={
              <button type="button" onClick={() => setSearch((s) => s + "")} className="btn-primary">
                Retry
              </button>
            }
          />
        )}

        {status === "ready" && meals.length === 0 && (
          <EmptyState
            action={
              <button type="button" onClick={clearAll} className="btn-primary">
                Clear filters
              </button>
            }
          />
        )}

        {status === "ready" && meals.length > 0 && <RecipeGrid meals={meals} />}
      </section>
    </div>
  );
}
