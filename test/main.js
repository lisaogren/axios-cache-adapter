// glob pattern for all test files
const tests = require.context('.', true, /.+\.spec\.js$/)

// Magic happening here !
tests.keys().forEach(tests)

const sources = require.context('../src/', true, /\.js$/)

sources.keys().forEach(sources)

export default tests
