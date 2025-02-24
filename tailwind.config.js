module.exports = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
    },
  },
  plugins: [
    // Add this plugin to hide scrollbars
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ]
} 