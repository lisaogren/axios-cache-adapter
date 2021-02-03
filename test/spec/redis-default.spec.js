/* globals describe it before beforeEach after */

import assert from 'assert'
import redis from 'redis-mock'
import RedisDefaultStore from 'src/redis-default'

describe('Redis Default store', () => {
  let store
  let client

  const TEN_SECONDS = 10 * 1000

  before(() => {
    client = redis.createClient()
    client.psetex = function (key, ms, value, cb) {
      client.setex(key, ms / 1000, value, cb)
    }
  })

  beforeEach(() => {
    store = new RedisDefaultStore(client)
  })

  after(() => {
    client.quit()
  })

  it('Should throw error if redis client is not valid', async () => {
    assert.throws(() => new RedisDefaultStore(null))
    assert.throws(() => new RedisDefaultStore({ constructor: null }))
    assert.throws(() => new RedisDefaultStore({ constructor: { name: 'MongoClient' } }))
  })

  it('Should accept custom prefix, and max scan count', async () => {
    const expectedPrefix = 'custom_prefix'

    const expectedScanCount = 123

    store = new RedisDefaultStore(client, {
      prefix: expectedPrefix,
      maxScanCount: expectedScanCount
    })
    assert.strictEqual(store.prefix, expectedPrefix)
    assert.strictEqual(store.maxScanCount, expectedScanCount)
  })

  it('getItem(): Should retrieve an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', {
      expires: Date.now() + TEN_SECONDS,
      expected
    })

    const value = await store.getItem('foo')

    assert.strictEqual(value.expected, expected)
  })

  it('setItem(): Should set an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', {
      expires: Date.now() + TEN_SECONDS,
      expected
    })

    const value = await store.getItem('foo')

    assert.strictEqual(value.expected, expected)
  })

  it('setItem(): Should set an item without a ttl', async () => {
    await store.clear()
    const expected = 'bar'

    await store.setItem('foo', { expected })

    const value = await store.getItem('foo')

    assert.strictEqual(value, null)
  })

  it('removeItem(): Should remove an item', async () => {
    await store.setItem('foo', {
      expires: Date.now() + TEN_SECONDS,
      expected: 'bar'
    })

    await store.removeItem('foo')

    const value = await store.getItem('foo')
    assert.strictEqual(value, null)
  })

  it('clear(): Should clear all set values', async () => {
    await store.setItem('foo', {
      expires: Date.now() + TEN_SECONDS,
      expected: 'bar'
    })
    await store.setItem('hello', {
      expires: Date.now() + TEN_SECONDS,
      expected: 'hello'
    })

    await store.clear()

    const length = await store.length()

    assert.strictEqual(length, 0)
  })

  it('Should serialize stored data to prevent modification by reference', async () => {
    const data = {
      key: 'value',
      expires: Date.now() + TEN_SECONDS
    }

    await store.setItem('key', data)

    data.key = 'other value'

    const storedData = await store.getItem('key')

    assert.notStrictEqual(data.key, storedData.key)
  })

  it('iterate(): Should iterate and invokes the function', async () => {
    await store.clear()

    await store.setItem('foo', {
      expires: Date.now() + TEN_SECONDS,
      expected: 'foo'
    })
    await store.setItem('bar', {
      expires: Date.now() + TEN_SECONDS,
      expected: 'bar'
    })
    await store.setItem('baz', {
      expires: Date.now() + TEN_SECONDS,
      expected: 'baz'
    })

    let count = 0

    function incrementCount () {
      count++
    }

    await store.iterate(incrementCount)

    assert.strictEqual(count, 3)
  })
})
