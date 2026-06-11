# Pantry — Recipe Finder 🍳

A dynamic recipe app built with **React** that fetches data from the public
[TheMealDB](https://www.themealdb.com/api.php) API. Browse, search and filter
recipes by name, category, cuisine, or ingredient, view full recipe details
with instructions and a video guide, and save favorites that persist across
sessions.

## ✨ Features

- **Recipe listings** — a responsive grid of recipe cards showing the name,
  thumbnail and category, each clickable for full details.
- **Search** — debounced search by recipe name.
- **Filters** — narrow recipes by category, cuisine (area), or main ingredient.
- **Search + filter together** — a server-side filter plus client-side name
  refinement (the free API key allows one server filter at a time).
- **Recipe details page** — full instructions, an ingredient checklist with
  measures, category/cuisine tags, source link and an embedded YouTube guide
  when available.
- **Favorites** — mark recipes with the heart; favorites are stored in
  `localStorage` and survive page reloads.
- **Surprise me** — jump straight to a random recipe.
- Accessible: keyboard focus styles, reduced-motion support, alt text.

## 🧱 Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) for navigation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Axios](https://axios-http.com/) for HTTP requests
- Public API: [TheMealDB](https://www.themealdb.com/api.php)

## 🚀 Getting started

You need [Node.js](https://nodejs.org/) 18+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

## 📁 Project structure

```
recipe-app/
├── index.html
├── netlify.toml            # Netlify build + SPA redirect config
├── tailwind.config.js
├── vite.config.js
├── public/
│   ├── _redirects          # SPA fallback for client-side routes
│   └── favicon.svg
└── src/
    ├── main.jsx            # App entry: Router + Favorites provider
    ├── App.jsx             # Routes, navbar, footer
    ├── index.css           # Tailwind layers + base styles
    ├── api/
    │   └── mealApi.js      # All TheMealDB calls (axios)
    ├── context/
    │   └── FavoritesContext.jsx   # Favorites state + localStorage
    ├── hooks/
    │   └── useDebounce.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── SearchBar.jsx
    │   ├── Filters.jsx
    │   ├── RecipeCard.jsx
    │   ├── RecipeGrid.jsx
    │   ├── Loader.jsx
    │   └── EmptyState.jsx
    └── pages/
        ├── Home.jsx
        ├── RecipeDetails.jsx
        └── Favorites.jsx
```

## 🌐 Deploying to Netlify

**Option A — connect your GitHub repo (recommended):**

1. Push this project to a GitHub repository (see below).
2. Go to [netlify.com](https://www.netlify.com), log in, and click
   **Add new site → Import an existing project**.
3. Pick your GitHub repo. Netlify reads `netlify.toml`, so the build settings
   fill in automatically:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy**. Your live URL appears in a minute or two.

**Option B — drag & drop:**

1. Run `npm run build` locally.
2. Drag the generated `dist/` folder onto the Netlify dashboard.

> The included `public/_redirects` and `netlify.toml` make sure deep links like
> `/recipe/52772` work on refresh.

## 🐙 Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Recipe App"
git branch -M main
git remote add origin https://github.com/<your-username>/recipe-app.git
git push -u origin main
```

## 📝 Notes on the API

TheMealDB uses the free test key `1` (already set in `src/api/mealApi.js`).
The `filter.php` endpoints return only `idMeal`, `strMeal` and `strMealThumb`,
so category badges only appear once full details load. Multi-ingredient
filtering and some endpoints require a premium key.

