import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV || 'development'

const plugins = [buble()]
const dest = {
  development: 'dist/cache.js',
  production: 'dist/cache.min.js'
}

if (env === 'production') {
  plugins.push(uglify())
}

export default {
  input: 'src/index.js',
  plugins,
  output: [
    { file: dest[env], format: 'umd', name: 'axiosCacheAdapter' }
  ]
}
