/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'sans-semibold': ['Inter-SemiBold', 'sans-serif'],
      },
      colors: {
        accent: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcdfff',
          300: '#8eccff',
          400: '#58afff',
          500: '#328dff',
          600: '#2372f5',
          700: '#1457e1',
          800: '#1746b6',
          900: '#193e8f',
          950: '#142757',
        },
      },
      height: {
        18: '5rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
