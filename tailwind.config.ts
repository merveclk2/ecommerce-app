/** @type {import('tailwindcss').Config} */

module.exports = {

  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",

        muted: "rgb(var(--muted) / <alpha-value>)",

        primary: "#6366f1",
      },

      boxShadow: {
        chat: "0 4px 20px rgba(0,0,0,0.35)",
      },

      borderRadius: {
        chat: "18px",
      },
    },
  },
};