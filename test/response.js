'use strict'

import response from '../lib/response.js'
import test from 'tape'

test('response body', t => {
  // cached value
  const value = {
    body: {
      response: '',
      responseText: '',
      responseType: 'text',
      status: 200,
      statusText: 'OK'
    }
  }

  const _response = response(value)

  t.equal(_response.responseType, value.body.responseType, 'responseType should be correct ')
  t.equal(_response.responseText, value.body.responseText, 'responseText should be correct ')
  t.equal(_response.response, value.body.response, 'response should be correct ')
  t.equal(_response.status, value.body.status, 'response status should be correct ')
  t.equal(_response.statusText, value.body.statusText, 'response statusText should be correct ')

  t.end()
})

test('response headers', t => {
  // cached value
  const value = {
    headers: {
      'content-type': 'type/text',
      'content-length': 1234
    }
  }

  const _response = response(value)

  t.deepEqual(_response.getAllResponseHeaders(), value.headers, 'cached response should have the getAllResponseHeaders()')
  t.equal(_response.getResponseHeader('content-type'), 'type/text', 'cached response should have the getResponseHeader()')

  t.end()
})

test('text response', t => {
  t.skip()
  t.end()
})

test('JSON response', t => {
  t.skip()
  t.end()
})

test('ArrayBuffer response', t => {
  // instanceof ArrayBuffer
  t.skip()
  t.end()
})
