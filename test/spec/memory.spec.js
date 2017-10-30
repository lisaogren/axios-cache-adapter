/* globals describe it beforeEach */

import assert from 'assert'
import isEmpty from 'lodash/isEmpty'

import MemoryStore from 'src/memory'

describe('Default memory store', () => {
  let store

  beforeEach(() => {
    store = new MemoryStore()
  })

  it('getItem(): Should retrieve an item', async () => {
    const expected = 'bar'

    store.store.foo = expected

    const value = await store.getItem('foo')

    assert.equal(value, expected)
  })

  it('setItem(): Should set an item', async () => {
    const expected = 'bar'

    await store.setItem('foo', expected)

    assert.equal(store.store.foo, expected)
  })

  it('removeItem(): Should remove an item', async () => {
    store.store.foo = 'bar'

    await store.removeItem('foo')

    assert.equal(store.store.foo, undefined)
  })

  it('clear(): Should clear all set values', async () => {
    store.store.foo = 'bar'
    store.store.hello = 'world'

    await store.clear()

    assert.equal(store.store.foo, undefined)
    assert.equal(store.store.hello, undefined)

    assert.ok(isEmpty(store.store))
  })
})
