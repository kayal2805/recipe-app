import { useEffect, useState } from "react";
import { listAreaNames, listCategoryNames, listIngredientNames } from "../api/mealApi.js";

/**
 * Filter controls. Only one server-side filter can be active at once on the
 * free key, so picking one clears the others. `filter` is a single object:
 * { type: "category" | "area" | "ingredient" | "", value: string }.
 */
export default function Filters({ filter, onChange }) {
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    let alive = true;
    Promise.all([listCategoryNames(), listAreaNames(), listIngredientNames()])
      .then(([c, a, i]) => {
        if (!alive) return;
        setCategories(c);
        setAreas(a);
        setIngredients(i);
      })
      .catch(() => {
        // Dropdowns simply stay empty if the lists fail to load.
      });
    return () => {
      alive = false;
    };
  }, []);

  const set = (type, value) => onChange(value ? { type, value } : { type: "", value: "" });

  const selectValue = (type) => (filter.type === type ? filter.value : "");

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Category */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Category
        </span>
        <select
          className="field"
          value={selectValue("category")}
          onChange={(e) => set("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {/* Area / cuisine */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Cuisine
        </span>
        <select
          className="field"
          value={selectValue("area")}
          onChange={(e) => set("area", e.target.value)}
        >
          <option value="">All cuisines</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      {/* Ingredient (searchable via datalist) */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Main ingredient
        </span>
        <input
          className="field"
          list="ingredient-options"
          placeholder="e.g. Chicken"
          value={selectValue("ingredient")}
          onChange={(e) => set("ingredient", e.target.value)}
        />
        <datalist id="ingredient-options">
          {ingredients.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
      </label>
    </div>
  );
}
