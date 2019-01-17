/* globals describe it */

import assert from 'assert'

import config from 'src/config'

describe('Per request config', () => {
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }

  const globalConfig = {
    maxAge: 0,
    limit: false,
    store: null,
    key: req => req.url,
    exclude: {
      paths: [],
      query: true,
      filter: null
    },
    adapter: null,
    clearOnStale: true,
    clearOnError: true,
    readOnError: false,
    debug
  }
  const fakeRequest = {
    url: 'https://fake-url.com'
  }

  it('Should merge per-request keys in a new object', () => {
    let requestConfig = { maxAge: 1000 }
    fakeRequest.cache = requestConfig

    let mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.notStrictEqual(globalConfig, mergedConfig)
    assert.notStrictEqual(requestConfig, mergedConfig)
  })

  it('Should merge the permitted keys', () => {
    let requestConfig = {
      maxAge: 10,
      key: 'myKey',
      exclude: true,
      clearOnStale: false,
      clearOnError: false,
      debug: () => {}
    }
    fakeRequest.cache = requestConfig

    let mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.equal(mergedConfig.maxAge, requestConfig.maxAge)
    assert.equal(mergedConfig.key, requestConfig.key)
    assert.equal(mergedConfig.exclude, requestConfig.exclude)
    assert.equal(mergedConfig.clearOnStale, requestConfig.clearOnStale)
    assert.equal(mergedConfig.clearOnError, requestConfig.clearOnError)
    assert.strictEqual(mergedConfig.debug, requestConfig.debug)

    assert.notEqual(mergedConfig.maxAge, globalConfig.maxAge)
    assert.notEqual(mergedConfig.key, globalConfig.key)
    assert.notEqual(mergedConfig.exclude, globalConfig.exclude)
    assert.notEqual(mergedConfig.clearOnStale, globalConfig.clearOnStale)
    assert.notEqual(mergedConfig.clearOnError, globalConfig.clearOnError)
    assert.notEqual(mergedConfig.debug, globalConfig.debug)
  })

  it('Should not merge the disallowed keys', () => {
    let requestConfig = {
      limit: true,
      store: 'abc',
      adapter: 'whoops',
      uuid: '1234',
      acceptStale: true
    }
    fakeRequest.cache = requestConfig

    let mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.equal(mergedConfig.limit, globalConfig.limit)
    assert.equal(mergedConfig.store, globalConfig.store)
    assert.equal(mergedConfig.adapter, globalConfig.adapter)
    assert.equal(mergedConfig.uuid, globalConfig.key(fakeRequest))
    assert.equal(mergedConfig.acceptStale, globalConfig.acceptStale)
  })

  it('Should transform the debug key when true', () => {
    let requestConfig = {
      debug: true
    }
    fakeRequest.cache = requestConfig

    let mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.ok(typeof mergedConfig.debug === 'function')
  })
})
