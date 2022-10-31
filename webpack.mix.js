let mix = require('laravel-mix');

mix.js('src/qrqandd.js', 'dist')
    .vue()
    .webpackConfig({
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': './src'
      }
    }
  })
