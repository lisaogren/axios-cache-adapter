/* globals describe it */

import assert from 'assert'

import serialize from 'src/serialize'

describe('Serialize', () => {
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }

  const config = { debug }
  const req = {}
  const res = { data: { youhou: true }, request: { fake: true }, config }

  const expected = { data: { youhou: true } }

  it('Should serialize response object', () => {
    assert.deepStrictEqual(serialize(config, req, res), expected)
  })

  it('Should parse response.data if in JSON format', () => {
    res.data = '{ "youhou": true }'

    assert.deepStrictEqual(serialize(config, req, res), expected)
  })
})
