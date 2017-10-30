/* globals describe it beforeEach */

import assert from 'assert'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'

import cache from 'src/cache'
import MemoryStore from 'src/memory'

describe('Cache store', () => {
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }

  let uuid
  let expires
  let store
  let config
  let req
  let res

  beforeEach(() => {
    uuid = 'test'
    expires = Date.now()
    store = new MemoryStore()

    config = { uuid, store, expires, debug }
    req = {}
    res = { data: { youhou: true }, request: { fake: true }, config }
  })

  it('Should expose a public API', () => {
    assert.ok(isFunction(cache.write))
    assert.ok(isFunction(cache.read))
    assert.ok(isFunction(cache.key))
  })

  it('Should write to cache', async () => {
    let cacheResult = await cache.write(config, req, res)

    assert.ok(cacheResult)

    assert.ok(isObject(store.store.test))
    assert.ok(store.store.test.data.data.youhou)
    assert.equal(store.store.test.expires, expires)

    store.setItem = async () => {
      throw new Error('Faking store error')
    }

    cacheResult = await cache.write(config, req, res)

    assert.equal(cacheResult, false)
  })

  it('Should clear cache if a store error occurs and clearOnError option is activated', async () => {
    config.clearOnError = true

    let cacheResult = await cache.write(config, req, res)

    assert.ok(cacheResult)

    store.setItem = async () => {
      throw new Error('Faking store error')
    }

    cacheResult = await cache.write(config, req, res)

    assert.equal(cacheResult, false)

    const length = await store.length()

    assert.equal(length, 0)
  })

  it('Should read from cache', async () => {
    try {
      await cache.read(config, req)
    } catch (err) {
      assert.equal(err.reason, 'cache-miss')
    }

    await cache.write(config, req, res)

    try {
      await cache.read(config, req)
    } catch (err) {
      assert.equal(err.reason, 'cache-stale')
    }

    config.expires = Date.now() + (15 * 60 * 1000) // Add 15min to cache expiry date

    await cache.write(config, req, res)

    const cacheData = await cache.read(config, req)

    assert.ok(cacheData.data.youhou)
  })

  it('Should generate a cache key', () => {
    const expected = function key () {}

    assert.deepEqual(cache.key({ key: expected }), expected)

    let cacheKey = cache.key({ key: 'my-key' })

    assert.ok(isFunction(cacheKey))
    assert.equal(cacheKey({ url: 'url' }), 'my-key/url')

    cacheKey = cache.key({})

    assert.ok(isFunction(cacheKey))
    assert.equal(cacheKey({ url: 'url' }), 'url')
  })
})
