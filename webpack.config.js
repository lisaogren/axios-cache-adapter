const path = require('path')
const webpack = require('webpack')

// Base filename and version variable to store what kind of version we'll be generating
let filename = 'cache[version].js'
let version = ['']

// Start with empty list of plugins and externals and an undefined devtool
const plugins = []
let externals = {}

// List external dependencies
const dependencies = [
  'lodash-es/partial',
  'lodash-es/extend',
  'lodash-es/omit',
  'axios'
]

// Check if we should make a bundled version
if (process.env.NODE_BUNDLED === 'please') {
  version.push('bundled')
} else {
  dependencies.forEach(dep => {
    externals[dep] = {
      umd: dep,
      amd: dep,
      commonjs: dep,
      commonjs2: dep
    }
  })
}

// Check if we should make a minified version
if (process.env.NODE_ENV === 'production') {
  version.push('min')

  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      },
      sourceMap: true
    })
  )
}

// Generate actual filename
// cache.js || cache.min.js || cache.bundled.js || cache.bundled.min.js
filename = filename.replace('[version]', version.join('.'))

// Webpack config
const build = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    library: 'axiosCacheAdapter',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', options: { presets: ['es2015'] } }
    ]
  },
  externals,
  plugins,
  devtool: 'source-map',
  target: 'web'
}

module.exports = build
