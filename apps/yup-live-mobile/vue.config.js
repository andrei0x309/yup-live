const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    windicss: {
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
    }
  },
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    devServer: {
      allowedHosts: "all"
    }
  },
});