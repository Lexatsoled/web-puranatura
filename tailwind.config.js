/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#047857', // Un verde principal más oscuro para mejor contraste
        secondary: '#059669', // Un verde esmeralda secundario
        accent: '#e69a00', // Un amarillo/naranja más oscuro para acentos con mejor contraste
      },
    },
  },
  plugins: [],
};
