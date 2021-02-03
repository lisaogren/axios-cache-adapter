/* globals describe it */

import assert from 'assert'

import exclude from 'src/exclude'

describe('Cache exclusion', () => {
  const url = 'https://some-rest.api/users'
  const debug = () => {}
  // const debug = (...args) => { console.log(...args) }

  it('Should not exclude if not configured', () => {
    const config = { debug }

    assert.strictEqual(exclude(config, { url }), false)
  })

  it('Should exclude requests with query parameters with config.exclude.query=true', () => {
    const config = {
      exclude: { query: true },
      debug
    }

    const reqWithQuery = { url: `${url}?with=query&params=42` }
    const reqWithParams = { url, params: { with: 'query', params: 42 } }
    const reqWithSearchParams = { url, params: new URLSearchParams('with=query&params=42') }

    assert.ok(exclude(config, reqWithQuery))
    assert.ok(exclude(config, reqWithParams))
    assert.ok(exclude(config, reqWithSearchParams))
  })

  it('Should not exclude requests with query parameters with config.exclude.query=false', () => {
    const config = {
      exclude: { query: false },
      debug
    }

    const reqWithQuery = { url: `${url}?with=query&params=42` }
    const reqWithParams = { url, params: { with: 'query', params: 42 } }
    const reqWithSearchParams = { url, params: new URLSearchParams('with=query&params=42') }

    assert.ok(!exclude(config, reqWithQuery))
    assert.ok(!exclude(config, reqWithParams))
    assert.ok(!exclude(config, reqWithSearchParams))
  })

  it('Should exclude requests that match paths', () => {
    const config = {
      exclude: { paths: [/\/users/] },
      debug
    }

    assert.ok(exclude(config, { url }))
    assert.strictEqual(exclude(config, { url: 'https://some-rest.api/invoices' }), false)
  })

  it('Should exclude filtered requests', () => {
    const config = {
      exclude: {
        filter: req => req.params && req.params.shouldExclude
      },
      debug
    }

    assert.ok(exclude(config, { url, params: { shouldExclude: true } }))
    assert.strictEqual(exclude(config, { url }), false)
  })
})
