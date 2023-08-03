import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import eslintPlugin from 'vite-plugin-eslint'
import WindiCSS from 'vite-plugin-windicss'
// import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import { ViteSSGOptions } from 'vite-ssg'
import generateSitemap from 'vite-ssg-sitemap'
import basicSsl from '@vitejs/plugin-basic-ssl'

const production = process.env.NODE_ENV === 'production'

const ssgOptions: ViteSSGOptions = {
  script: 'sync',
  formatting: 'minify',
  concurrency: 4,
  mock: true,
  mode: production ? 'production' : 'development',
  format: 'esm',
  onBeforePageRender: (route, indexHTML) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment
    // @ts-ignore ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          addListener: function () { },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          removeListener: function () { }
        }
      }
    return indexHTML
  },
  // includedRoutes: (paths) => {
  //   // exclude all the route paths that contains 'foo'
  //   return paths.filter(i => !i.includes(':') && !i.includes('raw') && !i.includes('emiss') && !i.includes('erro'))
  // },
  onFinished: () => {
    generateSitemap({
      hostname: 'https://yup-live.pages.dev'
    })
  }
}

export default defineConfig({
  publicDir: './public',
  define: {
    'process.env': {},
    'global': 'window'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    preserveSymlinks: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      stream: 'stream-browserify',
      http: 'http-browserify',
      https: 'https-browserify',
      util: 'util'
    }
  },
  plugins: [
    // nodePolyfills(),
    vue(),
    eslintPlugin(),
    WindiCSS(),
    basicSsl(),
  ],
  build: {
    rollupOptions: {
      // plugins: [nodePolyfills()]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  ssgOptions,
  server: {
    port: 4566,
    host: true,
    https: true
  }
})
