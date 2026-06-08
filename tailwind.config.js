/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tea: {
          50: '#f7f9f5',
          100: '#ecf0e9',
          200: '#d5dfcf',
          300: '#b2c7a7',
          400: '#8ba77d',
          500: '#688957',
          600: '#506c42',
          700: '#3f5634', // Matcha Green base
          800: '#34452a',
          900: '#2c3924',
          950: '#171e13',
        },
        warm: {
          50: '#fdfcfb',
          100: '#faf6f0',
          200: '#f4ebd9',
          300: '#edd8b7',
          400: '#e1bd8b',
          500: '#d19c5c',
          600: '#be7b38',
          700: '#9e5e2b',
          800: '#7f4924',
          900: '#673c20',
          950: '#3a2010',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(74, 98, 60, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(74, 98, 60, 0.15)',
        'glow-tea': '0 0 20px rgba(104, 137, 87, 0.15)',
      }
    },
  },
  plugins: [],
}
