'use strict'

import superapiCache from '../lib/index.js'
import test from 'blue-tape'
import { spy } from 'sinon'

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


test('should call cache function by default', t => {
  const cacheFn = spy()
  const handler = superapiCache({
    store: {
      cache: cacheFn
    }
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
  const cacheFn = spy(function () {})
  const handler = superapiCache({
    store: {
      cache: cacheFn
    }
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
