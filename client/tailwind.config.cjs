/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        siteblack: '#131519',
        siteDimBlack: '#191d23',
        siteViolet: '#7f46f0',
        siteWhite: '#9eacc7',
      },
      backgroundImage: {
        astral: "url('/src/assets/background/astral.jpg')",
        saiman: "url('/src/assets/background/saiman.jpg')",
        eoaalien: "url('/src/assets/background/eoaalien.jpg')",
        panight: "url('/src/assets/background/panight.jpg')",
        heroImg: "url('/src/assets/background/hero-img.jpg')",
        landing: "url('/src/assets/background/landing.jpg')",
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeIn: 'fadeIn 1s ease-in',
        slideIn: 'slideIn 1s ease-out',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translateX(-10%) skewX(3deg)' },
          '25%': { transform: 'translateX(10%) skewX(-3deg)' },
          '50%': { transform: 'translateX(-5%) skewX(2deg)' },
          '75%': { transform: 'translateX(5%) skewX(-1deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 50px rgba(255,0,0,0.3)' },
          '100%': { boxShadow: '0 0 100px rgba(255,0,0,0.6)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};
