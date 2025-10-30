/** @type {import('tailwindcss').Config} */
// Tenta carregar plugin de animações se disponível (fallback para desenvolvimento local)
let tailwindAnimate;
try {
	// eslint-disable-next-line global-require
	tailwindAnimate = require("tailwindcss-animate");
} catch (e) {
	tailwindAnimate = () => {};
}

module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				hover: '#E6C25A',
  				accent: '#1DD3C0',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			surface: {
  				light: '#FFFFFF',
  				dark: 'rgba(35,33,79,0.3)'
  			},
  			text: {
  				primary: {
  					light: '#23214F',
  					dark: '#F3F4F8'
  				},
  				secondary: {
  					light: '#5A5D74',
  					dark: '#9FA2B2'
  				},
  				muted: {
  					light: '#6B7280',
  					dark: '#9CA3AF'
  				}
  			},
  			border: 'hsl(var(--border))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
  				primary: '#1DD3C0',
  				secondary: '#D4AF37',
  				tertiary: '#5053C4'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))'
  		},
  		backgroundImage: {
  			'gradient-header': 'linear-gradient(90deg, #3B2CA4, #1DD3C0)',
  			'gradient-button': 'linear-gradient(90deg, #D4AF37, #E6C25A)',
  			'gradient-title': 'linear-gradient(90deg, #342CA4, #1DD3C0)'
  		},
  		borderRadius: {
  			DEFAULT: '12px',
  			lg: 'var(--radius)',
  			xl: '20px',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'sm-light': '0 1px 4px rgba(0,0,0,0.05)',
  			'sm-dark': '0 1px 4px rgba(0,0,0,0.2)',
  			'DEFAULT-light': '0 2px 8px rgba(0,0,0,0.05)',
  			'DEFAULT-dark': '0 2px 8px rgba(0,0,0,0.35)',
  			'glow-light': '0 0 12px rgba(29,211,192,0.2)',
  			'glow-dark': '0 0 12px rgba(29,211,192,0.4)'
  		},
  		fontSize: {
  			kpi: [
  				'2.5rem',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			header: [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			]
  		},
  		spacing: {
  			section: '1.5rem',
  			layout: '2rem'
  		}
  	}
  },
	plugins: [require('@tailwindcss/typography'), tailwindAnimate],
};
