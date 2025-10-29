/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#5053c4', dark: '#342ca4' },
        secondary: { light: '#333176', DEFAULT: '#232452' },
        neutral: { dark: '#12152c' },
        white: '#ffffff',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}