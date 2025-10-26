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
        primary: {
          DEFAULT: '#5053c4', // Cor primária principal
          dark: '#342ca4',    // Tom mais escuro da primária (antigo 'denary')
        },
        secondary: {
          light: '#333176', // Tom mais claro para elementos de UI (antigo 'secondary1')
          DEFAULT: '#232452', // Cor secundária principal (antigo 'secondary2')
        },
        neutral: {
          dark: '#12152c',   // Fundo mais escuro (antigo 'neutral-dark1')
        },
        white: '#ffffff',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <-- ADICIONE ESTA LINHA
  ],
}
