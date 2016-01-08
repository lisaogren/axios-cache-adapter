'use strict'

import superapiCache from '../lib/index.js'
import MemoryStore from '../lib/memory.js'
import readCache from '../lib/read-cache'
import serialize from '../lib/serialize'

import test from 'blue-tape'

test('middleware configuration need a store', t => {
  t.throws(() => {
    superapiCache()
  }, /Cache middleware need to be provided a store/, 'should throw if no store property found')

  t.doesNotThrow(() => {
    superapiCache({
      store: {}
    })
  }, 'should not throw with a valid store provided')

  t.end()
})

test.skip('middleware need a store with a valid API', t => {
  const handler = superapiCache({
    store: {}
  })

  return new Promise((resolve, reject) => {
    t.throws(() => {
      handler({}, function () {}, {})

      resolve()
    }, /Error/, 'should throw if invalid store provided')
  })
})

test('cache read function', t => {
  t.ok(superapiCache.readCache, 'should export default readCache')
  t.equals(superapiCache.readCache, readCache, 'readCache should be the one')
  t.end()
})

test('cache serialize function', t => {
  t.ok(superapiCache.serialize, 'should export default serialize')
  t.equals(superapiCache.serialize, serialize, 'serialize should be the one')
  t.end()
})
