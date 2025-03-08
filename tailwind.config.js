/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        siteblack: '#131519',
        siteDimBlack: '#191d23',
        siteViolet: '#7f46f0',
        siteWhite: '#9eacc7',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'cyberpunk-progress': 'progress 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'blink': 'blink 1.5s infinite',
        'typing': 'typing 3.5s steps(40) infinite',
        'pulse-width': 'pulse-width 2s ease-in-out infinite',
        'glitch': 'glitch 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 1s ease-in',
        'slideIn': 'slideIn 1s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'progress': {
          '0%': { width: '0%' },
          '50%': { width: '75%' },
          '100%': { width: '100%' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 }
        },
        'typing': {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '90%': { width: '100%' },
          '100%': { width: '0' }
        },
        'pulse-width': {
          '0%, 100%': { width: '30%', opacity: 0.6 },
          '50%': { width: '100%', opacity: 1 }
        },
        glitch: {
          '0%, 100%': { transform: 'translateX(-10%) skewX(3deg)' },
          '25%': { transform: 'translateX(10%) skewX(-3deg)' },
          '50%': { transform: 'translateX(-5%) skewX(2deg)' },
          '75%': { transform: 'translateX(5%) skewX(-1deg)' },
        },
        glow: {
          '0%': {
            filter: 'drop-shadow(0 0 0.5rem rgba(255, 0, 0, 0.3))',
          },
          '100%': {
            filter: 'drop-shadow(0 0 1rem rgba(255, 0, 0, 0.6))',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.1)',
        'neon-red': '0 0 10px rgba(255, 0, 0, 0.3), 0 0 20px rgba(255, 0, 0, 0.2), 0 0 30px rgba(255, 0, 0, 0.1)',
      },
    }
  },
  plugins: [],
}
