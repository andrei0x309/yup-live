import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
// import eslintPlugin from 'vite-plugin-eslint'
// import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import basicSsl from '@vitejs/plugin-basic-ssl'


export default defineConfig({
    publicDir: './public',
    define: {
        'process.env': {},
        // 'global': {}
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        preserveSymlinks: true,
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            stream: 'stream-browserify',
            http: 'http-browserify',
            https: 'https-browserify',
            util: 'util',
        }
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // nodePolyfills(),
        vue(),
        // eslintPlugin(),
        basicSsl()
    ],
    build: {
        rollupOptions: {
            // plugins: [nodePolyfills()]
            external: ['ionic/vue']
        },
        commonjsOptions: {
            transformMixedEsModules: true
        },
        chunkSizeWarningLimit: 5000 // 5mb
    },
    server: {
        port: 4875,
        host: true,
        https: {}
    }
})
