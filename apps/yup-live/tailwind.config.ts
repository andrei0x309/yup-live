import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096'
        }
      }
    }
  },
  extract: {
    // accepts globs and file paths relative to project root
    include: [
      'index.html',
      'src/**/*.{vue,html}',
      '../../packages/**/*.{vue,html}'
    ],
    exclude: [
      'node_modules/**/*',
      '.git/**/*',
      'dist/**/*',
      'public/**/*',
      '**/node_modules/**/*',
    ],
  },
  plugins: [
    plugin(({ addDynamic, variants }) => {
      addDynamic(
        'max-width',
        ({ Utility }) => {
          return Utility.handler.handleNumber(0, 130, 'int', (number) => `${number}rem`).createProperty('max-width')
        },
        {
          group: 'max-width',
          completions: ['max-width-{int}'],
          variants: variants('max-width')
        }
      )
    })
  ]
})
