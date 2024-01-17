/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096'
        }
      }
    },
    screens: {
      'xxxxs': '280px',
      'xxxs': '320px',
      'xxs': '360px',
      'xs': '400px',
      ...defaultTheme.screens
    }
  },
  content: ['index.html', 'src/**/*.{vue,html}', '../../packages/**/*.{vue,html}'],
  plugins: []
}
