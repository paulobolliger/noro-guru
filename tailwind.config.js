/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5053c4',
        denary: '#342ca4',
        secondary1: '#333176',
        secondary2: '#232452',
        'neutral-dark1': '#12152c',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
}

