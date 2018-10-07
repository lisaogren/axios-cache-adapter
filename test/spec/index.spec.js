/* globals describe it */

import assert from 'assert'
import has from 'lodash/has'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'

import { setup, setupCache } from 'src/index'
import MemoryStore from 'src/memory'

const REQUEST_TIMEOUT = 10000

describe('Integration', function () {
  const api = setup()

  it('Should expose a public API', function () {
    assert.ok(isFunction(setupCache))
    assert.ok(isFunction(setup))

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

  it('Should bust cache when sending something else than a GET request', async function () {
    this.timeout(REQUEST_TIMEOUT)

    await api.cache.clear()

    const url = 'https://httpbin.org/anything'

    let res = await api({ url })
    let length

    assert.equal(res.status, 200)
    length = await api.cache.length()

    assert.equal(length, 1)

    res = await api({ url, method: 'post' })
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
    // const definitionWithParams = {
    //   url: 'https://httpbin.org/get',
    //   params: { userId: 2 },
    //   method: 'get'
    // }

    let response = await api2(definition)

    assert.equal(response.status, 200)
    assert.ok(isObject(response.data))
    assert.ok(has(response.data.args, 'userId'))

    response = await api2(definition)

    assert.ok(has(response.data.args, 'userId'))
    assert.ok(response.request.fromCache)
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
