/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        mono:  ['"Fira Code"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
