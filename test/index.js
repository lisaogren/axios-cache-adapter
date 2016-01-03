'use strict'

import superapiCache from '../lib/index.js'
import test from 'tape'

test('awesome:test', t => {
  const message = 'everything is awesome'
  t.equals(superapiCache('awesome'), message, message)
  t.end()
})

