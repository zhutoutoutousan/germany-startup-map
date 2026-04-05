import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        club: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          900: '#0f0d14',
          950: '#08060f',
        },
        neon: {
          cyan: '#22d3ee',
          magenta: '#e879f9',
          lime: '#bef264',
          gold: '#fbbf24',
        },
        jade: '#34d399',
        cinnabar: {
          DEFAULT: '#e11d48',
          dark: '#be123c',
        },
        ink: {
          50: '#f7f4ef',
          100: '#ebe4d8',
          200: '#d4c9b8',
          300: '#b8a88f',
          400: '#8a7a66',
          500: '#5c5247',
          600: '#3d3429',
          700: '#2a241c',
          800: '#1a1612',
          900: '#0f0d0b',
        },
        parchment: {
          50: '#fdfaf5',
          100: '#f7f0e4',
          200: '#eedfcc',
          300: '#e3cba8',
        },
      },
      fontFamily: {
        club: ['var(--font-club)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Noto Serif SC', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.35), 0 0 2px rgba(34, 211, 238, 0.8)',
        'neon-fuchsia': '0 0 24px rgba(232, 121, 249, 0.35), 0 0 2px rgba(232, 121, 249, 0.7)',
        'neon-gold': '0 0 20px rgba(251, 191, 36, 0.25)',
        club: '0 24px 80px rgba(0, 0, 0, 0.55)',
        hub: '0 8px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      keyframes: {
        'disco-sheen': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.75' },
        },
        'grid-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '24px 24px' },
        },
      },
      animation: {
        'disco-sheen': 'disco-sheen 5s ease-in-out infinite',
        'grid-drift': 'grid-drift 20s linear infinite',
      },
      backgroundImage: {
        'disco-grid':
          'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,121,249,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
export default config
