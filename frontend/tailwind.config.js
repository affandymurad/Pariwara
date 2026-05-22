/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif:   ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        mono:    ['"Fira Code"', 'ui-monospace', 'monospace'],
      },
      colors: {
        sage:  { DEFAULT: '#6B8F71', light: '#EAF2EB', dark: '#3D5C42', deep: '#2A4430' },
        amber: { DEFAULT: '#C98A3A', light: '#FDF3E3', dark: '#935F1E' },
        stone: { DEFAULT: '#7A7065', light: '#F5F2EE', muted: '#A09488' },
        ink:   { DEFAULT: '#1E1B18', 2: '#3A3630', 3: '#5C5750' },
        cream: { DEFAULT: '#FDFCF9', 2: '#F7F4F0', 3: '#F0EDE8' },
      },
    },
  },
  plugins: [],
};
