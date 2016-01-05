'use strict'

import superapiCache from '../lib/index.js'
import MemoryStore from '../lib/memory.js'
import readCache from '../lib/read-cache'

import test from 'blue-tape'
import { spy } from 'sinon'

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

test('middleware need a store with a valid API', t => {
  const handler = superapiCache({
    store: {},
    cache: function () {}
  })

  const next = () => {
    return Promise.resolve()
  }

  t.throws(() => {
    handler({}, next, {})
  }, /store.getItem/, 'should throw if invalid store provided')

  t.end()
})

test('cache read function', t => {
  t.ok(superapiCache.readCache, 'should export default readCache')
  t.equals(superapiCache.readCache, readCache, 'readCache should be the one')
  t.end()
})

test('should call cache function by default', t => {
  t.skip('disabled test')
  t.end()

  const cacheFn = spy()
  const handler = superapiCache({
    store: new MemoryStore(),
    cache: cacheFn
  })

  const next = () => {
    return Promise.resolve()
  }
  const service = {}

  return new Promise((resolve) => {
    handler({}, next, service).then(() => {
      t.ok(cacheFn.called, 'cache function should have been called')
      t.ok(cacheFn.calledOnce, 'cache function should have been called once')

      resolve()
    })
  })
})

test('disable cache', t => {
  t.skip('disabled test')
  t.end()

  const cacheFn = spy(function () {})
  const handler = superapiCache({
    store: {},
    cache: cacheFn
  })

  const next = () => {
    return Promise.resolve()
  }
  const service = {
    use: {
      cache: false
    }
  }

  return new Promise((resolve) => {
    handler({}, next, service).then(() => {
      t.ok(cacheFn.notCalled, 'cache function should not have been called')

      resolve()
    })
  })
})
