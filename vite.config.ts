import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url"; import eslintPlugin from 'vite-plugin-eslint'
import WindiCSS from 'vite-plugin-windicss'
import nodePolyfills from 'rollup-plugin-polyfill-node'
const production = process.env.NODE_ENV === 'production';


export default defineConfig({
  publicDir: './public',
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      stream: 'stream-browserify',
    }
  },
  plugins: [
    !production && nodePolyfills({
      include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
    }),
    vue(), eslintPlugin(), WindiCSS()
  ],
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills()
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    port: 4566
  }
})
