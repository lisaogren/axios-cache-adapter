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
    const requestConfig = { maxAge: 1000 }
    fakeRequest.cache = requestConfig

    const mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.notStrictEqual(globalConfig, mergedConfig)
    assert.notStrictEqual(requestConfig, mergedConfig)
  })

  it('Should merge the permitted keys', () => {
    const requestConfig = {
      maxAge: 10,
      key: 'myKey',
      exclude: {
        query: false
      },
      clearOnStale: false,
      clearOnError: false,
      debug: () => {}
    }
    fakeRequest.cache = requestConfig

    const mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.equal(mergedConfig.maxAge, requestConfig.maxAge)
    assert.equal(mergedConfig.key, requestConfig.key)
    assert.deepEqual(mergedConfig.exclude, {
      ...globalConfig.exclude,
      ...requestConfig.exclude
    })
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
    const requestConfig = {
      limit: true,
      store: 'abc',
      adapter: 'whoops',
      uuid: '1234',
      acceptStale: true
    }
    fakeRequest.cache = requestConfig

    const mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.equal(mergedConfig.limit, globalConfig.limit)
    assert.equal(mergedConfig.store, globalConfig.store)
    assert.equal(mergedConfig.adapter, globalConfig.adapter)
    assert.equal(mergedConfig.uuid, globalConfig.key(fakeRequest))
    assert.equal(mergedConfig.acceptStale, globalConfig.acceptStale)
  })

  it('Should transform the debug key when true', () => {
    const requestConfig = {
      debug: true
    }
    fakeRequest.cache = requestConfig

    const mergedConfig = config.mergeRequestConfig(globalConfig, fakeRequest)

    assert.ok(typeof mergedConfig.debug === 'function')
  })
})
