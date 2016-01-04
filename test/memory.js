'use strict'

import MemoryStore from '../lib/memory.js'
import test from 'tape'

test('MemoryStore getItem', t => {
  const store = new MemoryStore()
  const expected = 'bar'

  store._store.foo = expected

  return new Promise((resolve) => {
    store.getItem('foo').then((value) => {
      t.equals(value, expected, 'store should return the previously recorded value')

      resolve()
    })
  })
})

test('MemoryStore setItem', t => {
  const store = new MemoryStore()

  const expected = 'bar'

  return new Promise((resolve) => {
    store.setItem('foo', expected).then(() => {
      store.getItem('foo').then((value) => {
        t.equals(value, expected, 'store should return the previously recorded value')

        resolve()
      })
    })
  })
})

test('MemoryStore clear', t => {
  const store = new MemoryStore()

  store._store.foo = 'something'

  return new Promise((resolve) => {
    store.clear()
      .then(() => {
        return store.getItem('foo')
      })
      .then((value) => {
        t.equals(value, null, 'store should be emtpy');

        resolve()
      })
  })
})
