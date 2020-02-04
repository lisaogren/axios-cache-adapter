/* globals describe it beforeEach */

import assert from 'assert'
import redis from 'redis-mock'
import RedisStore from 'src/redis'

describe('Redis store', () => {
  let store
  const client = redis.createClient()

  beforeEach(() => {
    store = new RedisStore(client)
  })

  it('Should throw error if redis client is not valid', async () => {
    assert.throws(() => new RedisStore(null))
    assert.throws(() => new RedisStore({ constructor: null }))
    assert.throws(() => new RedisStore({ constructor: { name: 'MongoClient' } }))
  })

  it('Should accept custom HASH_KEY', async () => {
    const expected = 'customHash'
    store = new RedisStore(client, expected)
    assert.strictEqual(store.HASH_KEY, expected)
  })

  it('getItem(): Should retrieve an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', expected)

    const value = await store.getItem('foo')

    assert.strictEqual(value, expected)
  })

  it('setItem(): Should set an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', expected)

    const value = await store.getItem('foo')

    assert.strictEqual(value, expected)
  })

  it('removeItem(): Should remove an item', async () => {
    await store.setItem('foo', 'bar')

    await store.removeItem('foo')

    const value = await store.getItem('foo')
    assert.strictEqual(value, null)
  })

  it('clear(): Should clear all set values', async () => {
    await store.setItem('foo', 'bar')
    await store.setItem('hello', 'hello')

    await store.clear()

    const length = await store.length()

    assert.strictEqual(length, 0)
  })

  it('Should serialize stored data to prevent modification by reference', async () => {
    const data = {
      key: 'value'
    }

    await store.setItem('key', data)

    data.key = 'other value'

    const storedData = await store.getItem('key')

    assert.notStrictEqual(data.key, storedData.key)
  })
})
