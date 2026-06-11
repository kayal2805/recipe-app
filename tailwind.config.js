/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF7F0",
        "paper-dark": "#F1E8DA",
        ink: "#2A2320",
        "ink-soft": "#6B5D52",
        plum: "#5B2A48",
        "plum-deep": "#3E1B31",
        saffron: "#E8A33D",
        "saffron-soft": "#F6D9A6",
        sage: "#76876A",
        berry: "#C2456A",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,35,32,0.06), 0 8px 24px rgba(42,35,32,0.08)",
        "card-hover": "0 4px 8px rgba(42,35,32,0.08), 0 16px 40px rgba(42,35,32,0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        pop: "pop 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
