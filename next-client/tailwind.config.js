module.exports = {
  theme: {
    extend: {
      animation: {
        'cyberpunk-progress': 'progress 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'blink': 'blink 1.5s infinite',
        'typing': 'typing 3.5s steps(40) infinite',
        'pulse-width': 'pulse-width 2s ease-in-out infinite',
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
        }
      }
    }
  }
}
