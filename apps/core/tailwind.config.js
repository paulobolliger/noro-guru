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
        noro: {
          primary:       '#232452',
          accent:        '#19b8a8',
          surface:       '#ffffff',
          'surface-2':   '#f6f7fb',
          fg:            '#1f2433',
          border:        '#eceef3',
          'border-strong': '#dfe2ea',
        },
      },
      fontFamily: {
        // Set by Next.js font system via CSS variables
        sans:    ['var(--font-sans)',    'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia',   'serif'],
        mono:    ['var(--font-mono)',    'ui-monospace', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
    },
  },
  plugins: [],
}
