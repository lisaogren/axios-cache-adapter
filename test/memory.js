'use strict'

import MemoryStore from '../lib/memory.js'
import test from 'tape'

test('MemoryStore getItem', t => {
  const store = new MemoryStore()
  const expected = 'bar'

  store._store.foo = expected

  t.equals(store.getItem('foo'), expected, 'store should return the previously recorded value')

  t.end()
})

test('MemoryStore setItem', t => {
  const store = new MemoryStore()

  const expected = 'bar'

  store.setItem('foo', expected)

  t.equals(store.getItem('foo'), expected, 'store should return the previously recorded value')

  t.end()
})

test('MemoryStore clear', t => {
  const store = new MemoryStore()

  store.setItem('foo', 1234)
  store.clear()

  t.equals(store.getItem('foo'), null, 'store should be emtpy');

  t.end()
})
