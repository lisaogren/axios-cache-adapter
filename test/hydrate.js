'use strict'

import hydrate from '../lib/hydrate'
import test from 'tape'
import req from './helpers/req'
import response from './helpers/response'

test('hydrate closure', t => {
  const closure = hydrate({})

  t.equals(typeof closure, 'function', 'hydrate should return a closure')
  t.end()
})

test('hydrate closure is a promise', t => {
  const closure = hydrate({})

  t.ok(closure() instanceof Promise, 'hydrate should return a promise')
  t.end()
})

test('hydrate success callback', t => {
  const value = {
    body: {
      responseType: 'text',
      responseText: 'Hello world',
      status: 200,
      statusText: 'OK'
    },
    headers: {
      'content-type': 'text/plain'
    }
  }

  req.response = function () {
    return response(this)
  }

  return new Promise((resolve) => {
    hydrate(req)(value)
      .then((res) => {
        t.equals(res.body, value.body.responseText, 'response should be defined')

        resolve()
      })
      .catch((err) => {
        // add test in case of error
        t.error(err, 'hydration should not throw')

        resolve()
      })
  })
})
