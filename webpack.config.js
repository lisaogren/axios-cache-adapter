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

let mode = 'development'
let target = 'web'
let entry = './src/index.js'

// List external dependencies
const dependencies = [
  'axios'
]

dependencies.forEach(dep => {
  externals[dep] = {
    umd: dep,
    amd: dep,
    commonjs: dep,
    commonjs2: dep
  }
})

if (process.env.NODE_BUILD_FOR === 'node') {
  version.push('node')
  target = 'node'
  entry = './src/index.node.js'
}

const polyfillExclusions = [
  'es6.array.filter',
  'es6.array.for-each',
  'es6.array.index-of',
  'es6.array.is-array',
  'es6.array.map',
  'es6.array.some',
  'es6.date.now',
  'es6.date.to-string',
  'es6.number.constructor',
  'es6.object.define-properties',
  'es6.object.define-property',
  'es6.object.keys',
  'es6.object.to-string',
  'es6.promise',
  // 'es6.regexp.exec',
  'es6.regexp.match',
  'es6.regexp.to-string',
  'es6.string.iterator',
  'es6.string.trim',
  'web.dom.iterable'
]

// Check if we should make a minified version
if (process.env.NODE_ENV === 'production') {
  version.push('min')

  mode = 'production'
}

// Generate actual filename
// cache.js || cache.min.js || cache.node.js || cache.node.min.js
filename = filename.replace('[version]', version.join('.'))

// Webpack config
const build = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    library: 'axiosCacheAdapter',
    libraryTarget: 'umd'
  },
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/cache-control-esm')
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                exclude: polyfillExclusions,
                include: ['transform-classes']
              }]
            ]
          }
        }]
      }
    ]
  },
  externals,
  plugins,
  devtool: 'source-map',
  target
}

// TEST CONFIG
const test = {
  entry: ['test/main.js'],
  output: {
    path: path.join(cwd, '.tmp'),
    filename: 'main.js'
  },
  resolve: {
    modules: ['node_modules', '.']
  },
  mode: 'development',
  module: {
    rules: [
      // Transpile ES2015 to ES5
      {
        test: /\.js$/,
        exclude: /node_modules|\utilities.spec\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  // exclude: polyfillExclusions,
                  useBuiltIns: 'usage'
                }]
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/
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
