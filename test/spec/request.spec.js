/* globals describe it beforeEach */

import assert from 'assert'
import { isFunction } from 'lodash'

import request from 'src/request'
import { key } from 'src/cache'
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
      debug
    }

    req = {
      url: 'url',
      method: 'GET'
    }

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

  it('Should notify an exclusion and clear cache for http methods !== get', async () => {
    req.method = 'POST'

    await store.setItem('url', res)

    const result = await request(config, req)

    testExclusion(result)

    const length = await store.length()

    assert.equal(length, 0)
  })

  // Helpers

  function testExclusion ({ next, config }) {
    assert.ok(isFunction(next))
    assert.ok(config.excludeFromCache)
  }
})
