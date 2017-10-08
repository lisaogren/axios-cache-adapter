'use strict'

import test from 'blue-tape'
import { spy } from 'sinon'

import debug from 'debug'
const log = debug('cache')

import superapiCache from '../lib/index.js'
import MemoryStore from '../lib/memory.js'
import hydrate from '../lib/hydrate.js'
import serialize from '../lib/serialize'

import Request from './helpers/req'

test.skip('hit from cache', t => {
  return new Promise((resolve) => {
    const fixtures = require('./fixtures/hello')
    const store = new MemoryStore()

    store._store['/api/foo'] = fixtures

    const options = {
      store: store,
      log: log
    }

    const next = spy(() => {
      return Promise.resolve()
    })

    const req = new Request()

    req.method = 'get'
    req.url = '/api/foo'

    return superapiCache(options)(req, next, {})
      .then(res => {
        t.notOk(next.called, 'next should not be called')
        t.equal(fixtures.data.body.status, res.status, 'should retrieve the same status from cache')
        t.equal(fixtures.data.body.responseText, res.responseText, 'should retrieve the same responseText from cache')

        resolve()
      }).catch(err => { // eslint-disable-line handle-callback-err
        t.fail('should not throw error')
        resolve()
      })
  })
})

test('miss from cache', t => {
  return new Promise(resolve => {
    const fixtures = require('./fixtures/hello')
    const options = {
      store: new MemoryStore()
    }

    const req = new Request()

    req.method = 'get'
    req.url = '/api/foo'
    req.xhr = hydrate(fixtures.data)

    const fetchNetwork = spy(req, 'response')
    const next = () => {
      return Promise.resolve(req.response())
    }

    return superapiCache(options)(req, next, {})
      .then(res => {
        t.ok(fetchNetwork.called, 'should fetch response from network')
        t.equal(fixtures.data.body.status, res.status, 'should retrieve the same status from cache')
        t.equal(fixtures.data.body.responseText, res.responseText, 'should retrieve the same responseText from cache')

        req.response.restore()
        resolve()
      }).catch(err => { // eslint-disable-line handle-callback-err
        t.fail('should not throw error')

        req.response.restore()
        resolve()
      })
  })
})

test('fetch network', t => {
  return new Promise(resolve => {
    const fixtures = require('./fixtures/hello')
    const store = new MemoryStore()
    const _serialize = spy(serialize)

    const options = {
      store: store,
      serialize: _serialize
    }

    const req = new Request()

    req.method = 'get'
    req.url = '/api/foo'
    req.xhr = hydrate(fixtures.data)

    const fetchNetwork = spy(req, 'response')
    const next = () => {
      return Promise.resolve(req.response())
    }

    return superapiCache(options)(req, next, {})
      .then(res => {
        t.ok(fetchNetwork.called, 'should fetch response from network')

        store.getItem(req.url)
          .then((value) => {
            t.ok(value, 'it should have copy the response in the cache')
            t.ok(_serialize.called, 'it should have serialized the response in the cache')
            t.equal(value.data.body.status, res.status, 'it should have the same status from network')
            t.equal(value.data.body.responseText, res.responseText, 'it should have the same responseText from network')
            const type = res.getResponseHeader('content-type')

            t.equal(value.headers['content-type'], type, 'it should have the same responseText from network')

            req.response.restore()
            resolve()
          })

      }).catch(err => { // eslint-disable-line handle-callback-err
        t.fail('should not throw error')

        req.response.restore()
        resolve()
      })
  })
})
