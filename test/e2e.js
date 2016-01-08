'use strict'

import test from 'blue-tape'
import { spy } from 'sinon'

import debug from 'debug'
const log = debug('cache')

import superapiCache from '../lib/index.js'
import MemoryStore from '../lib/memory.js'
import hydrate from '../lib/hydrate.js'

import req from './helpers/req'
import response from './helpers/response';

test('hit from cache', t => {
  return new Promise((resolve) => {
    const fixtures = require('./fixtures/hello')

    const store = new MemoryStore()
    store._store['/api/foo'] = JSON.stringify(fixtures)

    const options = {
      store: store
    }

    const next = spy(() => { return Promise.resolve() } )

    req.url = '/api/foo'
    req.response = () => {
      return response(req)
    }

    return superapiCache(options)(req, next, {})
      .then((res) => {
        t.notOk(next.called, 'next should not be called')
        t.equal(fixtures.body.status, res.status, 'should retrieve the same status from cache')
        t.equal(fixtures.body.responseText, res.responseText, 'should retrieve the same responseText from cache')

        resolve()
      }).catch(() => {
        t.fail('should not throw error')
        resolve()
      })
  })
})


test('miss from cache', t => {
  return new Promise((resolve) => {
    const fixtures = require('./fixtures/hello');
    const options = {
      store: new MemoryStore()
    }

    req.url = '/api/foo'
    req.set('response', hydrate(JSON.stringify(fixtures)))

    const fetchNetwork = spy(req, 'response')
    const next = () => {
      return Promise.resolve(req.response())
    }

    return superapiCache(options)(req, next, {})
      .then((res) => {
        t.ok(fetchNetwork.called, 'should fetch response from network')
        t.equal(fixtures.body.status, res.status, 'should retrieve the same status from cache')
        t.equal(fixtures.body.responseText, res.responseText, 'should retrieve the same responseText from cache')

        resolve()
      }).catch((err) => {
        t.fail('should not throw error')
        resolve()
      })
  })
})

test.skip('fetch network', t => {
  t.ok(false, 'should add to cache on 2xx')
  t.end()
})
