'use strict'

import superapiCache from '../lib/index.js'
import memoryStore from '../lib/memory.js'
import readCache from '../lib/read-cache'
import serialize from '../lib/serialize'

import test from 'blue-tape'

test('middleware store', t => {
  const config = {}

  superapiCache(config)

  t.equals(config.store, memoryStore, 'should use the default store if none provided')
  t.end()
})

test('middleware store', t => {
  const dict = new Map()
  const store = {
    getItem: (k) => {
      return dict.get(k)
    },
    setItem: (k, v) => {
      return dict.set(k, v)
    }
  }

  const config = {
    store: store
  }

  superapiCache(config)

  t.equals(config.store, store, 'should use the custom store provided')
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
