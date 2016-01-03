'use strict'

import superapiCache from '../lib/index.js'
import test from 'tape'

test('middleware configuration', t => {
  t.throws(() => {
    superapiCache()
  }, /Cache middleware need to be provided a store/, 'should throw if no store property found')

  t.throws(() => {
    superapiCache({
      store: {
        foo: 'bar'
      }
    })
  }, /Store does not have a cache function/, 'should throw if invalid store provided')

  t.doesNotThrow(() => {
    superapiCache({
      store: {
        cache: function () {}
      }
    })
  }, 'should not throw if valid store provided')
  t.end()
})
