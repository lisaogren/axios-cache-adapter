// glob pattern for all test files
const context = require.context('.', true, /.+\.spec\.js$/)

// window.Promise = require('bluebird')

// Magic happening here !
context.keys().forEach(context)

module.exports = context
