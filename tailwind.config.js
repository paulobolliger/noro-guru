/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        guru: '#5053C4',
        noro: '#342CA4',
        core: '#1DD3C0',
        futuro: '#2E2E3A',
        light: '#F3F4F8',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #5053C4 0%, #342CA4 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 0px rgba(29, 211, 192, 0.0))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(29, 211, 192, 0.45))' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      display: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
      mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '8px',
      md: '10px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    }
  },
  plugins: [],
}
