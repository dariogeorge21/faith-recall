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
        gold: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe699',
          300: '#ffd966',
          400: '#ffcc33',
          500: '#ffbf00',
          600: '#cc9900',
          700: '#997300',
          800: '#664d00',
          900: '#332600',
        },
        burgundy: {
          50: '#f5e6e8',
          100: '#ebccd1',
          200: '#d799a3',
          300: '#c36675',
          400: '#af3347',
          500: '#9b0019',
          600: '#7c0014',
          700: '#5d000f',
          800: '#3e000a',
          900: '#1f0005',
        },
      },
      animation: {
        'flip': 'flip 0.4s ease-in-out',
        'glow-green': 'glow-green 0.8s ease-in-out',
        'shake-red': 'shake-red 0.8s ease-in-out',
        'flicker': 'flicker 0.4s ease-in-out',
        'fade-out': 'fade-out 0.8s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        'glow-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(34, 197, 94, 0.6)' },
        },
        'shake-red': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

