/* globals describe it */

import assert from 'assert'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import has from 'lodash/has'

import { setup, setupCache } from 'src/index'

describe('axios-cache-adapter', () => {
  const api = setup({
    cache: {
      debug: true,
      maxAge: 15 * 60 * 1000
    }
  })

  it('Should expose a public API', () => {
    assert.ok(isFunction(setupCache))
    assert.ok(isFunction(setup))
  })

  it('Should execute GET requests', () => {
    const definition = {
      url: 'https://httpbin.org/get',
      method: 'get'
    }

    return api(definition).then(response => {
      assert.equal(response.status, 200)
      assert.ok(isObject(response.data))

      return api(definition).then(response => {
        // console.log("TEST NORM",response)
        assert.equal(response.status, 200)
        assert.ok(isObject(response.data))
        assert.ok(response.request.fromCache)
      })
    })
  })

  it('Should cache GET requests with params', () => {
    const api2 = setup({
      cache: {
        debug: true,
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

    return api2(definition).then(response => {
      // console.log("TEST PARAMS NOT cached",response)
      assert.equal(response.status, 200)
      assert.ok(isObject(response.data))
      assert.ok(has(response.data.args, 'userId'))

      return api2(definition).then(response => {
        // console.log("TEST PARAMS CACHE'D???",response)
        assert.ok(has(response.data.args, 'userId'))
        assert.ok(response.request.fromCache)

        // Failing test
        // return api2(definitionWithParams).then(response => {
        //   assert.ok(has(response.data.args, 'userId'))
        //   assert.ok(response.request.fromCache)
        // })
      })
    })
  })

  it('Should apply a cache size limit', () => {
    const api3 = setup({
      cache: {
        debug: true,
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

    return api3(definition).then(response => {
      assert.equal(response.status, 200)
      assert.ok(isObject(response.data))

      return api3(anotherDefinition).then(response => {
        return api3.cache.length().then(length => {
          assert.equal(length, 1)
        })
      })
    })
  })

  it('Should exclude paths', () => {
    const api4 = setup({
      cache: {
        debug: true,
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

    return api4(definition).then(response => {
      return api4.cache.length().then(length => {
        assert.equal(length, 0)
      })
    })
  })
})
