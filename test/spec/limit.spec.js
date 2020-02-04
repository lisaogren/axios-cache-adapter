/* globals describe it */

import assert from 'assert'
import isFunction from 'lodash/isFunction'
import redis from 'redis-mock'

import limit from 'src/limit'
import MemoryStore from 'src/memory'
import RedisStore from 'src/redis'

describe('Limit', () => {
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }
  const client = redis.createClient()

  const stores = [new MemoryStore(), new RedisStore(client)]

  it('Should expose a function', () => {
    assert.ok(isFunction(limit))
  })

  stores.forEach((store) => {
    const config = { store, debug }

    it('Should remove first item from store', async () => {
      const now = Date.now()

      await store.setItem('test', { expires: now })
      await store.setItem('retest', { expires: now + (60 * 1000) })

      let length = await store.length()

      assert.strictEqual(length, 2)

      await limit(config)

      length = await store.length()

      assert.strictEqual(length, 1)
    })
  })
})
