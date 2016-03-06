'use strict'

import readCache from '../lib/read-cache'
import test from 'blue-tape'
import Request from './helpers/req'

test('readCache closure', t => {
  const closure = readCache({})

  t.equals(typeof closure, 'function', 'reading from cache should return a closure')
  t.end()
})

test('readCache closure is a promise', t => {
  const closure = readCache({})

  t.ok(closure() instanceof Promise, 'reading from cache should return a promise')
  t.end()
})

test('readCache success callback', t => {
  const value = {
    expires: 0,
    data: {
      body: {
        responseType: 'text',
        responseText: 'Hello world',
        status: 200,
        statusText: 'OK'
      },
      headers: 'content-type: text/plain'
    }
  }

  const req = new Request()

  return new Promise((resolve) => {
      .then((res) => {
    readCache(req)(value)
        t.equals(res.body, value.data.body.responseText, 'response should be defined')

        resolve()
      })
      .catch((err) => {
        // add test in case of error
        t.error(err, 'hydration should not throw')

        resolve()
      })
  })
})

test('readCache error callback', t => {
  return new Promise((resolve) => {
    readCache(req)(false)
      .then((res) => {
  const req = new Request()

        t.error('response should not be defined on cache miss')

        resolve()
      })
      .catch((err) => {
        // add test in case of error
        t.equals(err.reason, 'cache-miss', 'reading from cache should throw on cache miss')

        resolve()
      })
  })
})
