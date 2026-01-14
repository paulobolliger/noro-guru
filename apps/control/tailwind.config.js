/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
	darkMode: ["class"],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}', // Caso use pages router
		'../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))", // Branco puro
				foreground: "hsl(var(--foreground))", // Texto escuro

				// Cores semânticas personalizadas
				surface: {
					DEFAULT: "hsl(var(--surface))",   // Fundo geral da página (off-white)
					alt: "hsl(var(--surface-alt))",   // Fundo alternativo
				},

				primary: {
					DEFAULT: "hsl(var(--primary))",     // Indigo
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",   // Ouro/Gold (Use com moderação!)
					foreground: "hsl(var(--secondary-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-bg))",
					foreground: "hsl(var(--sidebar-fg))",
					active: "hsl(var(--sidebar-active))",
					accent: "hsl(var(--sidebar-accent))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--background))",
					foreground: "hsl(var(--foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--background))",
					foreground: "hsl(var(--foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'"Helvetica Neue"',
					'Arial',
					'sans-serif',
				],
			},
			backgroundImage: {
				// Gradient Premium (Use em headers ou cards especiais)
				'gradient-noro': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}