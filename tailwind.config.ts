
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				todo: {
					'bg': '#0a0a15',
					'text': '#ffffff',
					'accent': '#00c8ff',
					'divider': '#1a1a30',
					'completed': '#8E8E93',
					'hover': '#151530'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'scale': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'check-mark': {
					'0%': { 
						'stroke-dashoffset': '20', 
						opacity: '0'
					},
					'100%': { 
						'stroke-dashoffset': '0',
						opacity: '1'
					}
				},
				'floating-slow': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'25%': { transform: 'translateY(-15px) rotate(-2deg)' },
					'50%': { transform: 'translateY(-5px) rotate(2deg)' },
					'75%': { transform: 'translateY(-10px) rotate(-1deg)' },
				},
				'galaxy-spin': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'nebula-pulse': {
					'0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' }
				},
				'cosmic-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 15px rgba(0, 200, 255, 0.4), 0 0 30px rgba(0, 200, 255, 0.2)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 25px rgba(0, 200, 255, 0.6), 0 0 50px rgba(0, 200, 255, 0.3)',
						transform: 'scale(1.03)'
					}
				},
				'star-shine': {
					'0%, 100%': { 
						filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))'
					},
					'50%': { 
						filter: 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.9))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'scale': 'scale 0.2s ease-out',
				'check-mark': 'check-mark 0.3s ease-out forwards',
				'floating-slow': 'floating-slow 10s ease-in-out infinite',
				'galaxy-spin': 'galaxy-spin 60s linear infinite',
				'nebula-pulse': 'nebula-pulse 8s ease-in-out infinite',
				'cosmic-glow': 'cosmic-glow 5s ease-in-out infinite',
				'star-shine': 'star-shine 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
