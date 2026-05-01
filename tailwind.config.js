/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C9A96E',
        'primary-hover': '#E2C28A',
        'bg-dark': '#0A0A0A',
        'bg-surface': '#111111',
        'bg-surface-secondary': '#1A1A1A',
        'text-primary': '#F5F3EE',
        'text-secondary': '#888780',
        'accent-success': '#5DCAA5',
        'accent-danger': '#E24B4A',
      },
    },
  },
  plugins: [],
}
