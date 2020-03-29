/* globals describe it */

import assert from 'assert'
import has from 'lodash/has'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import MockDate from 'mockdate'

import localforage from 'localforage'
import memoryDriver from 'localforage-memoryStorageDriver'

import { setup, setupCache, serializeQuery } from 'src/index'
import MemoryStore from 'src/memory'

const REQUEST_TIMEOUT = 10000

describe('Integration', function () {
  const api = setup()

  it('Should expose a public API', function () {
    assert.ok(isFunction(setupCache))
    assert.ok(isFunction(setup))
    assert.ok(isFunction(serializeQuery))

    const cache = setupCache()

    assert.ok(isObject(cache))
    assert.ok(isObject(cache.store))
    assert.ok(isFunction(cache.adapter))

    checkStoreInterface(cache.store)
    checkStoreInterface(api.cache)
  })

  it('Should execute GET requests', async function () {
    this.timeout(REQUEST_TIMEOUT)

    const definition = {
      url: 'https://httpbin.org/get',
      method: 'get'
    }

    let response = await api(definition)

    assert.equal(response.status, 200)
    assert.ok(isObject(response.data))

    response = await api(definition)

    assert.equal(response.status, 200)
    assert.ok(isObject(response.data))
    assert.ok(response.request.fromCache)
  })

  it('Should not cache requests with a status not in the 2xx range', async function () {
    this.timeout(REQUEST_TIMEOUT)

    await api.cache.clear()

    try {
      await api({ url: 'https://httpbin.org/status/404' })
    } catch (err) {
      assert.equal(err.response.status, 404)

      const length = await api.cache.length()

      assert.equal(length, 0)
    }
  })

  it('Should bust cache when sending something else than a get, post, patch, put or delete request', async function () {
    this.timeout(REQUEST_TIMEOUT)

    await api.cache.clear()

    const url = 'https://httpbin.org/anything'

    let res = await api({ url })
    let length

    assert.equal(res.status, 200)
    length = await api.cache.length()

    assert.equal(length, 1)

    res = await api({ url, method: 'OPTIONS' })
    length = await api.cache.length()

    assert.equal(length, 0)
  })

  it('Should cache GET requests with params', async function () {
    this.timeout(REQUEST_TIMEOUT)

    const api2 = setup({
      cache: {
        // debug: true,
        maxAge: 15 * 60 * 1000,
        exclude: {
          query: false
        }
      }
    })

    const definition = {
      url: 'https://httpbin.org/get?userId=2',
      method: 'get'
    }
    const definitionWithParams = {
      url: 'https://httpbin.org/get',
      params: { userId: 2 },
      method: 'get'
    }

    let response = await api2(definition)

    assert.equal(response.status, 200)
    assert.ok(isObject(response.data))
    assert.ok(has(response.data.args, 'userId'))
    assert.ok(!response.request.fromCache)

    response = await api2(definitionWithParams)

    assert.ok(has(response.data.args, 'userId'))
    assert.ok(response.request.fromCache)

    definitionWithParams.params = new URLSearchParams('userId=2')

    response = await api2(definitionWithParams)

    assert.ok(has(response.data.args, 'userId'))
    assert.ok(response.request.fromCache)
  })

  it('Should cache GET requests with params even though URLSearchParams does not exist', async () => {
    const URLSearchParamsBackup = URLSearchParams
    window.URLSearchParams = undefined

    const api = setup({
      cache: {
        exclude: { query: false }
      }
    })

    const definition = {
      url: 'https://httpbin.org/get',
      params: { userId: 42 },
      method: 'get'
    }

    let response = await api(definition)

    assert.equal(response.status, 200)
    assert.ok(has(response.data.args, 'userId'))
    assert.ok(!response.request.fromCache)

    response = await api(definition)

    assert.ok(has(response.data.args, 'userId'))
    assert.ok(response.request.fromCache)

    window.URLSearchParams = URLSearchParamsBackup
  })

  it('Should apply a cache size limit', async function () {
    this.timeout(REQUEST_TIMEOUT)

    const config = {
      cache: {
        // debug: true,
        maxAge: 15 * 60 * 1000,
        limit: 3
      }
    }
    const api3 = setup(config)

    const endpoints = ['get', 'ip', 'uuid', 'user-agent']

    const send = () => Promise.all(
      endpoints.map(
        endpoint => api3({
          url: `https://httpbin.org/${endpoint}`
        })
      )
    )

    const responses = await send()

    responses.forEach(response => {
      assert.equal(response.status, 200)
      assert.ok(isObject(response.data))
    })

    const length = await api3.cache.length()

    assert.equal(length, config.cache.limit)
  })

  it('Should exclude paths', async function () {
    this.timeout(REQUEST_TIMEOUT)

    const api4 = setup({
      cache: {
        // debug: true,
        maxAge: 15 * 60 * 1000,
        exclude: {
          paths: [
            /.+/ // Exclude everything
          ]
        }
      }
    })

    const definition = {
      url: 'https://httpbin.org/get',
      method: 'get'
    }

    const response = await api4(definition)

    assert.ok(isObject(response.data))

    const length = await api4.cache.length()

    assert.equal(length, 0)
  })

  it('Should activate debugging mode or take a debug function', () => {
    let cache = setupCache({
      debug: true
    })

    assert.ok(isFunction(cache.config.debug))

    cache.config.debug('testing debug message')

    cache = setupCache({
      debug: (msg) => msg
    })

    assert.ok(isFunction(cache.config.debug))
    assert.equal(cache.config.debug('test'), 'test')
  })

  it('Should take an optional store', () => {
    const store = new MemoryStore()
    const cache = setupCache({ store })

    assert.deepEqual(cache.store, store)
  })

  it('Should be able to transform response whether it comes from network or cache', async function () {
    this.timeout(REQUEST_TIMEOUT)

    const api5 = setup()

    const request = () => api5({
      url: 'https://httpbin.org/get?a=foo&b=bar',
      transformResponse: [
        (data, header) => {
          return data.args.a + data.args.b
        }
      ],
      cache: {
        exclude: {
          query: false
        }
      }
    })

    let response = await request()
    let response2 = await request()
    let response3 = await request()

    assert.ok(!response.request.fromCache)
    assert.equal(response.data, 'foobar')

    assert.ok(response2.request.fromCache)
    assert.equal(response2.data, 'foobar')

    assert.ok(response3.request.fromCache)
    assert.equal(response3.data, 'foobar')

    // assert.doesNotThrow(async () => {
    //   response = await request()
    //   assert.ok(response.request.fromCache)
    //   assert.equal(response.data, 'foobar')

    //   assert.doesNotThrow(async () => {
    //     response = await request()
    //     assert.ok(response.request.fromCache)
    //     assert.equal(response.data, 'foobar')
    //   })
    // })
  })

  it('Should read stale cache data when a request error occurs when readOnError option is activated', async () => {
    const url = 'https://httpbin.org/status/404'
    const api5 = setup({
      cache: {
        // debug: true,
        maxAge: 1,
        readOnError: (err, config) => {
          return err.response.status === 404
        },
        clearOnStale: false
      }
    })

    await api5.cache.setItem(url, {
      expires: Date.now() - (60 * 1000),
      data: {
        data: { yay: true }
      }
    })

    const response = await api5({ url })

    assert.ok(response.data.yay)
    assert.ok(response.request.stale)
  })

  it('Should take a localforage instance as store', async () => {
    await localforage.defineDriver(memoryDriver)

    const store = localforage.createInstance({
      driver: memoryDriver._driver
    })

    const apiWithStore = setup({
      cache: {
        store
      }
    })

    const url = 'https://httpbin.org/get'

    const response = await apiWithStore({
      url,
      method: 'get'
    })

    assert.equal(response.status, 200)
    assert.ok(isObject(response.data))

    const { data } = await store.getItem(url)

    assert.equal(data.status, 200)
    assert.equal(data.data.url, url)
  })

  it('Should be able to set caching options per request', async function () {
    this.timeout(REQUEST_TIMEOUT)

    const api = setup({
      cache: {
        // debug: true,
        maxAge: 15 * 60 * 1000
      }
    })

    const request = (cache) => api({
      url: 'https://httpbin.org/get',
      method: 'get',
      cache
    })

    let response = await request()
    assert.ok(!response.request.fromCache)

    await sleep(1000)

    response = await request()
    assert.ok(response.request.fromCache)

    await api.cache.clear()

    response = await request({ maxAge: 1 })
    assert.ok(!response.request.fromCache)

    await sleep(1000)

    response = await request({ maxAge: 1 })
    assert.ok(!response.request.fromCache)
  })

  it('Should throw an error when a network error occurs and readOnError option is not activated', async () => {
    const api = setup()

    assertThrowsAsync(async () => {
      const response = await api.get('https://httpbin.org/status/500')

      // Should never get here
      assert.ok(!response.request.fromCache)
    })
  })

  it('Should read max-age from cache-control header', async () => {
    MockDate.set(10000000)

    const api = setup({
      baseURL: 'https://httpbin.org',
      cache: { readHeaders: true }
    })

    const response = await api.get('/cache/2345')

    assert.ok(!response.request.fromCache)

    const item = await api.cache.getItem('https://httpbin.org/cache/2345')

    assert.equal(item.expires, 12345000)

    MockDate.reset()
  })

  it("when no cache-control header", async () => {
    MockDate.set(10000000)

    const api = setup({
      baseURL: "https://httpbin.org",
      cache: { readHeaders: true }
    })

    const response = await api.get("/cache")

    assert.ok(!response.request.fromCache)

    const item = await api.cache.getItem("https://httpbin.org/cache/")

    assert.equal(item.expires, 1000000)

    MockDate.reset()
  })

  it('Should exclude from cache when reading no-cache or must-revalidate from cache-control', async () => {
    const baseURL = 'https://httpbin.org'
    const noCacheRoute = '/response-headers?cache-control=no-cache'
    const noStoreRoute = '/response-headers?cache-control=no-store'

    const api = setup({
      baseURL,
      cache: {
        readHeaders: true,
        exclude: { query: false }
      }
    })

    let response = await api.get(noCacheRoute)

    assert.ok(!response.request.fromCache)
    assert.ok(response.request.excludedFromCache)

    response = await api.get(noStoreRoute)

    assert.ok(!response.request.fromCache)
    assert.ok(response.request.excludedFromCache)
  })

  it('Should read expires header', async () => {
    const baseURL = 'https://httpbin.org'
    const dateInThePast = 'Sun, 06 Nov 1994 08:49:37 GMT'
    const route = '/response-headers?expires=' + encodeURIComponent(dateInThePast)

    const api = setup({
      baseURL,
      cache: {
        readHeaders: true,
        exclude: { query: false }
      }
    })

    let response = await api.get(route)

    assert.ok(!response.request.fromCache)
    assert.ok(!response.request.excludedFromCache)

    const item = await api.cache.getItem(baseURL + route)

    assert.equal(item.expires, new Date(dateInThePast).getTime())

    response = await api.get(route)

    assert.ok(!response.request.fromCache)
    assert.ok(!response.request.excludedFromCache)
  })

  it('should invalidate cache with a custom method', async () => {
    this.timeout(REQUEST_TIMEOUT)

    // Create cached axios instance with custom invalidate method
    const api = setup({
      cache: {
        maxAge: 15 * 60 * 1000,
        // Invalidate only when a specific option is passed through config
        invalidate: async (config, request) => {
          if (request.clearCacheEntry) {
            await config.store.removeItem(config.uuid)
          }
        }
      }
    })

    // Make a request that will get stored into cache
    let response = await api.get('https://httpbin.org/get')

    assert.ok(!response.request.fromCache)

    // Wait some time
    await sleep(1000)

    // Make another request to same end point but force cache invalidation
    response = await api.get('https://httpbin.org/get', { clearCacheEntry: true })

    // Response should not come from cache
    assert.ok(!response.request.fromCache)
  })

  // Helpers

  function checkStoreInterface (store) {
    assert.ok(isObject(store))
    assert.ok(isFunction(store.getItem))
    assert.ok(isFunction(store.setItem))
    assert.ok(isFunction(store.removeItem))
    assert.ok(isFunction(store.clear))
    assert.ok(isFunction(store.iterate))
    assert.ok(isFunction(store.length))
  }
})

function sleep (time = 0) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

async function assertThrowsAsync (fn, regExp) {
  let f = () => {}

  try {
    await fn()
  } catch (e) {
    f = () => { throw e }
  } finally {
    assert.throws(f, regExp)
  }
}
