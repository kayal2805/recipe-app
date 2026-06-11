import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pantry.favorites.v1";
const FavoritesContext = createContext(null);

function readInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  // Each favorite is a light meal: { idMeal, strMeal, strMealThumb, strCategory }
  const [favorites, setFavorites] = useState(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage may be unavailable (private mode) — fail quietly.
    }
  }, [favorites]);

  const value = useMemo(() => {
    const ids = new Set(favorites.map((f) => f.idMeal));

    const isFavorite = (id) => ids.has(id);

    const toggleFavorite = (meal) => {
      setFavorites((prev) => {
        if (prev.some((f) => f.idMeal === meal.idMeal)) {
          return prev.filter((f) => f.idMeal !== meal.idMeal);
        }
        return [
          {
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            strCategory: meal.strCategory || "",
          },
          ...prev,
        ];
      });
    };

    return { favorites, isFavorite, toggleFavorite, count: favorites.length };
  }, [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
