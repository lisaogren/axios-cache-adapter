/* globals describe it */

import assert from 'assert'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import has from 'lodash/has'

import { setup, setupCache } from 'src/index'

describe('axios-cache-adapter', () => {
  const api = setup({
    cache: {
      // debug: true,
      maxAge: 15 * 60 * 1000
    }
  })

  it('Should expose a public API', () => {
    assert.ok(isFunction(setupCache))
    assert.ok(isFunction(setup))
  })

  it('Should execute GET requests', async () => {
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

  it('Should bust cache when sending something else than a GET request', async () => {
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

  it('Should cache GET requests with params', async () => {
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

  it('Should apply a cache size limit', async () => {
    const api3 = setup({
      cache: {
        // debug: true,
        maxAge: 15 * 60 * 1000,
        limit: 1
      }
    })

    const definition = {
      url: 'https://httpbin.org/get',
      method: 'get'
    }

    const anotherDefinition = {
      url: 'https://httpbin.org/ip',
      method: 'get'
    }

    let response = await api3(definition)

    assert.equal(response.status, 200)
    assert.ok(isObject(response.data))

    response = await api3(anotherDefinition)

    const length = await api3.cache.length()

    assert.equal(length, 1)
  })

  it('Should exclude paths', async () => {
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
    const length = await api4.cache.length()

    assert.equal(length, 0)
  })
})
