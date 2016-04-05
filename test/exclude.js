'use strict'

import exclude from '../lib/exclude.js'

import test from 'blue-tape'

test('default exclusion', t => {
  const req = {
    url: '/foo'
  }

  t.notOk(exclude(req), 'should not exclude by default')
  t.end()
})

test('service description exclusion', t => {
  const req = {
    url: '/foo'
  }

  t.notOk(exclude(req, {}), 'should not exclude if no service description defined')
  t.ok(exclude(req, {use: { cache: false } }), 'should exclude on a falsy service description')
  t.notOk(exclude(req, {use: { cache: true } }), 'should not exclude on a truthy service description')
  t.notOk(exclude(req, {use: 'foo'}), 'should not exclude on a truthy service description')
  t.end()
})

test('filter function exclusion', t => {
  const req = {
    url: '/foo'
  }

  t.notOk(exclude(req, null, {}), 'should not exclude if function missing')
  t.ok(exclude(req, null, {
    filter: function (req) {
      return req.url !== '/foo'
    }
  }), 'should exclude if function return false')

  const req1 = {
    url: '/foo',
    method: 'head'
  }
  const exclusions1 = {
    filter: function (req) {
      return req.method !== 'head'
    }
  }

  t.ok(exclude(req1, null, exclusions1), 'should exclude head method')

  const req2 = {
    url: '/foo',
    method: 'get'
  }

  const exclusions2 = {
    filter: function (req) {
      return req.method !== 'get'
    }
  }

  t.ok(exclude(req2, null, exclusions2), 'should exclude non get method')
  t.end()
})
