/* globals describe it beforeEach */

import assert from 'assert'
import Redis from 'ioredis-mock'
import RedisStore from 'src/ioredis'

describe('Redis store', () => {
  let store
  const client = new Redis()

  beforeEach(() => {
    store = new RedisStore(client)
  })

  it('Should accept custom HASH_KEY', async () => {
    const expected = 'customHash'
    store = new RedisStore(client, expected)
    assert.equal(store.HASH_KEY, expected)
  })

  it('getItem(): Should retrieve an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', expected)

    const value = await store.getItem('foo')

    assert.equal(value, expected)
  })

  it('setItem(): Should set an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', expected)

    const value = await store.getItem('foo')

    assert.equal(value, expected)
  })

  it('removeItem(): Should remove an item', async () => {
    await store.setItem('foo', 'bar')

    await store.removeItem('foo')

    const value = await store.getItem('foo')
    assert.equal(value, null)
  })

  it('clear(): Should clear all set values', async () => {
    await store.setItem('foo', 'bar')
    await store.setItem('hello', 'hello')

    await store.clear()

    const length = await store.length()

    assert.equal(length, 0)
  })

  it('Should serialize stored data to prevent modification by reference', async () => {
    const data = {
      key: 'value'
    }

    await store.setItem('key', data)

    data.key = 'other value'

    const storedData = await store.getItem('key')

    assert.notEqual(data.key, storedData.key)
  })
})
