let mix = require('laravel-mix');

mix.js('src/demo.js', 'dist')
    .js('src/lib.js', 'dist')
    .vue({ version: 2 })
