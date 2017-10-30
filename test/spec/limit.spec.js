/* globals describe it beforeEach */

import assert from 'assert'
import isFunction from 'lodash/isFunction'

import limit from 'src/limit'
import MemoryStore from 'src/memory'

describe('Limit', () => {
  let store
  let config
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }

  beforeEach(() => {
    store = new MemoryStore()
    config = { store, debug }
  })

  it('Should expose a function', () => {
    assert.ok(isFunction(limit))
  })

  it('Should remove first item from store', async () => {
    const now = Date.now()

    await store.setItem('test', { expires: now })
    await store.setItem('retest', { expires: now + (60 * 1000) })

    let length = await store.length()

    assert.equal(length, 2)

    await limit(config)

    length = await store.length()

    assert.equal(length, 1)
  })
})
