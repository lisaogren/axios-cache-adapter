'use strict'

import hydrate from '../lib/hydrate.js'
import test from 'tape'

test('hydrate response body', t => {
  // cached value
  const value = {
    body: {
      responseText: '',
      responseType: 'text',
      status: 200,
      statusText: 'OK'
    }
  }

  const _response = hydrate(value)

  t.equal(_response.responseType, value.body.responseType, 'responseType should be correct ')
  t.equal(_response.responseText, value.body.responseText, 'responseText should be correct ')
  t.equal(_response.status, value.body.status, 'response status should be correct ')
  t.equal(_response.statusText, value.body.statusText, 'response statusText should be correct ')

  t.end()
})

test('hydrate response headers', t => {
  // cached value
  const value = {
    headers: 'content-type: type/text\ncontent-length: 1234\n'
  }

  const _response = hydrate(value)
  const allHeaders = _response.getAllResponseHeaders()
  const typeHeader = _response.getResponseHeader('content-type')

  t.deepEqual(allHeaders, value.headers, 'cached response should have the getAllResponseHeaders()')
  t.equal(typeHeader, 'type/text', 'cached response should have the getResponseHeader()')

  t.end()
})

test('hydrate text response', t => {
  t.skip()
  t.end()
})

test('hydrate JSON response', t => {
  t.skip()
  t.end()
})

test('hydrate ArrayBuffer response', t => {
  // instanceof ArrayBuffer
  t.skip()
  t.end()
})
