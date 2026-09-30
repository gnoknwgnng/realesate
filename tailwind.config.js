/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF9',
          100: '#E0F7F4',
          200: '#B2EBE2',
          300: '#80DDD0',
          400: '#32C5B0',
          500: '#00B09B',
          600: '#009688',
          700: '#007E70', // Primary MedProperties Logo Teal
          800: '#00665A',
          900: '#004D40',
        },
        navy: {
          800: '#0E3B43',
          900: '#0A2540',
          950: '#061826',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
