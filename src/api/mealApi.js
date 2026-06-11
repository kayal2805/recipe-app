import axios from "axios";

// TheMealDB free/test key is "1". All endpoints documented at:
// https://www.themealdb.com/api.php
const api = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
  timeout: 12000,
});

/**
 * TheMealDB returns ingredients as 20 flat pairs:
 * strIngredient1..20 + strMeasure1..20.
 * This normalises them into a clean array, dropping empties.
 */
export function parseIngredients(meal) {
  if (!meal) return [];
  const items = [];
  for (let i = 1; i <= 20; i += 1) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      items.push({
        name: name.trim(),
        measure: (measure || "").trim(),
        thumb: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
          name.trim()
        )}-small.png`,
      });
    }
  }
  return items;
}

// Search meals by name (returns full meal objects, or null when nothing matches).
export async function searchMealsByName(query) {
  const { data } = await api.get("/search.php", { params: { s: query } });
  return data.meals || [];
}

// Filter endpoints return a LIGHT object: idMeal, strMeal, strMealThumb only.
export async function filterByCategory(category) {
  const { data } = await api.get("/filter.php", { params: { c: category } });
  return data.meals || [];
}

export async function filterByArea(area) {
  const { data } = await api.get("/filter.php", { params: { a: area } });
  return data.meals || [];
}

export async function filterByIngredient(ingredient) {
  // The API expects spaces as underscores for ingredient filters.
  const value = ingredient.trim().replace(/\s+/g, "_");
  const { data } = await api.get("/filter.php", { params: { i: value } });
  return data.meals || [];
}

// Full detail for a single meal by id.
export async function getMealById(id) {
  const { data } = await api.get("/lookup.php", { params: { i: id } });
  return data.meals ? data.meals[0] : null;
}

// One random meal (used for the landing "Surprise me").
export async function getRandomMeal() {
  const { data } = await api.get("/random.php");
  return data.meals ? data.meals[0] : null;
}

// Rich category list including thumbnails + descriptions.
export async function getCategories() {
  const { data } = await api.get("/categories.php");
  return data.categories || [];
}

// Simple name lists used to populate filter dropdowns.
export async function listCategoryNames() {
  const { data } = await api.get("/list.php", { params: { c: "list" } });
  return (data.meals || []).map((m) => m.strCategory);
}

export async function listAreaNames() {
  const { data } = await api.get("/list.php", { params: { a: "list" } });
  return (data.meals || []).map((m) => m.strArea);
}

export async function listIngredientNames() {
  const { data } = await api.get("/list.php", { params: { i: "list" } });
  return (data.meals || [])
    .map((m) => m.strIngredient)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Central query used by the Home page.
 * Only one server-side filter can be active at a time on the free key,
 * so we run that filter first, then refine the results by the search term
 * on the client. This lets "search + filter" work together.
 */
export async function fetchRecipes({ search = "", category = "", area = "", ingredient = "" }) {
  let meals = [];

  if (category) {
    meals = await filterByCategory(category);
  } else if (area) {
    meals = await filterByArea(area);
  } else if (ingredient) {
    meals = await filterByIngredient(ingredient);
  } else if (search.trim()) {
    meals = await searchMealsByName(search.trim());
  } else {
    // Default landing view: an alphabetic sample so the grid is never empty.
    meals = await searchMealsByName("a");
  }

  // Client-side refine by name when a filter is active alongside a search term.
  if ((category || area || ingredient) && search.trim()) {
    const q = search.trim().toLowerCase();
    meals = meals.filter((m) => m.strMeal.toLowerCase().includes(q));
  }

  return meals;
}
