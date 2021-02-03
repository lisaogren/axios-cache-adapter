/* globals describe it beforeEach */

import assert from 'assert'
import { isFunction } from 'lodash'

import request from 'src/request'
import { key, invalidate } from 'src/cache'
import MemoryStore from 'src/memory'
describe('Request', () => {
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }
  let config
  let req
  let res
  // let expires
  let store

  beforeEach(() => {
    // expires = Date.now()
    store = new MemoryStore()

    config = {
      key: key('test'),
      store,
      debug,
      invalidate: invalidate()
    }

    req = {
      url: 'https://httpbin.org/',
      method: 'GET'
    }

    config.uuid = config.key(req)

    res = { data: { youhou: true }, request: { fake: true }, config }
  })

  it('Should export a function', () => {
    assert.ok(isFunction(request))
  })

  it('Should notify an exclusion if url matches exclude params', async () => {
    // Exclude everything
    config.exclude = {
      paths: [/.+/]
    }

    const result = await request(config, req)

    testExclusion(result)
  })

  it('Should notify an exclusion for http head method', async () => {
    req.method = 'HEAD'

    const result = await request(config, req)

    testExclusion(result)
  })

  it('Should notify an exclusion and clear cache for http methods not one of get, post, patch, put or delete', async () => {
    req.method = 'OPTIONS'

    await store.setItem('https://httpbin.org/', res)

    const result = await request(config, req)

    testExclusion(result)

    const length = await store.length()

    assert.strictEqual(length, 0)
  })

  it('Should clear based on new invalidate function', async () => {
    config.invalidate = async (cfg, req) => {
      const method = req.method.toLowerCase()
      const prefix = 'deleteme'
      if (method === 'get') return
      await cfg.store.iterate(async (_, key) => {
        if (key.startsWith(prefix)) {
          await config.store.removeItem(key)
        }
      })
    }
    req.method = 'POST'
    await store.setItem('deleteme', res)
    await store.setItem('url', res)

    await request(config, req)

    const length = await store.length()

    assert.strictEqual(length, 1)
  })

  // Helpers
  function testExclusion ({ next, config }) {
    assert.ok(isFunction(next))
    assert.ok(config.excludeFromCache)
  }
})
