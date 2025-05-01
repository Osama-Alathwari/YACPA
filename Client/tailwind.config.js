// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    // Disable preflight to prevent overriding PrimeReact styles
    preflight: false,
  },
  important: false, // Change to true if you want Tailwind to have higher specificity
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        'primary': {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '800': '#075985',
          '900': '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}