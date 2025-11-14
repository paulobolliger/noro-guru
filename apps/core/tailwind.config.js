/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './(protected)/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from design tokens
        primary: {
          50: '#f0f1ff',
          100: '#e0e2ff',
          200: '#c7caff',
          300: '#a5a9ff',
          400: '#7d82ff',
          500: '#5053c4',
          600: '#342ca4',
          700: '#232452',
          800: '#1a1a3e',
          900: '#12122b',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#D4AF37',
          500: '#b8941f',
          600: '#997a16',
          700: '#7a6010',
          800: '#5c470c',
          900: '#3d2f08',
        },
      },
      // Custom utilities
      animation: {
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}
