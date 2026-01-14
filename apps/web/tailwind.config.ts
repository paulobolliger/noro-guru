import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'noro-purple': 'var(--color-noro-purple-light)',
        'noro-blue': 'var(--color-noro-primary)',
        'noro-turquoise': 'var(--color-noro-accent)',
        'noro-dark': 'var(--color-noro-dark)',
        'noro-dark-purple': 'var(--color-noro-dark-purple)',
        'noro-dark-2': 'var(--color-noro-surface-dark)',
        'noro-gray-light': 'var(--color-noro-light)',
        'noro-accent': 'var(--color-noro-gray-accent)',
        'noro-gray-future': 'var(--color-noro-gray-future)',
        'noro-gold': 'var(--color-noro-gold)',
        'noro-text-primary': 'var(--color-noro-text-primary)',
        'noro-text-secondary': 'var(--color-noro-text-secondary)',
        'noro-text-muted': 'var(--color-noro-text-muted)',
        'noro-text-body': 'var(--color-noro-text-body)',
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
