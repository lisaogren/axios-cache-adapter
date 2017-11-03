const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const cwd = process.cwd()

// Base filename and version variable to store what kind of version we'll be generating
let filename = 'cache[version].js'
let version = ['']

// Start with empty list of plugins and externals and an undefined devtool
const plugins = []
let externals = {}

// List external dependencies
const dependencies = [
  'lodash/isEmpty',
  'lodash/isString',
  'lodash/isFunction',
  'lodash/size',
  'lodash/find',
  'lodash/map',
  'lodash/extend',
  'lodash/merge',
  'lodash/omit',
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
  entry: ['babel-regenerator-runtime', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    library: 'axiosCacheAdapter',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['transform-async-to-generator']
          }
        }]
      }
    ]
  },
  externals,
  plugins,
  devtool: 'source-map',
  target: 'web'
}

// TEST CONFIG
const test = {
  entry: 'test/main.js',
  output: {
    path: path.join(cwd, '.tmp'),
    filename: 'main.js'
  },
  resolve: {
    modules: ['node_modules', '.']
  },
  module: {
    rules: [
      // Transpile ES2015 to ES5
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader', options: { presets: ['es2015'] } }
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      },

      // Load font files
      { test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/, loader: 'file-loader' },
      { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ],
  devServer: {
    // contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    port: 3000
  },
  target: 'web',
  devtool: 'inline-source-map'
}

module.exports = process.env.NODE_ENV === 'test' ? test : build
