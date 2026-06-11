import RecipeCard from "./RecipeCard.jsx";

export default function RecipeGrid({ meals }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {meals.map((meal, i) => (
        <RecipeCard key={meal.idMeal} meal={meal} index={i} />
      ))}
    </div>
  );
}
