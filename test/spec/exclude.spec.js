/* globals describe it */

import assert from 'assert'

import exclude from 'src/exclude'

describe('Cache exclusion', () => {
  const url = 'https://some-rest.api/users'
  const debug = () => {}
  const methods = ['post', 'patch', 'put', 'delete']
  const method = 'get'
  // const debug = (...args) => { console.log(...args) }

  it('Should exclude requests which are listed by config.exclude.methods parameter', () => {
    const config = {
      exclude: { methods },
      debug
    }

    assert.ok(exclude(config, { url, method: 'post' }))
    assert.ok(exclude(config, { url, method: 'patch' }))
    assert.ok(exclude(config, { url, method: 'put' }))
    assert.ok(exclude(config, { url, method: 'delete' }))
    assert.ok(exclude(config, { url, method: 'head' }))
  })

  it('Should exclude requests with query parameters with config.exclude.query=true', () => {
    const config = {
      exclude: { query: true, methods },
      debug
    }

    const reqWithQuery = { url: `${url}?with=query&params=42`, method }
    const reqWithParams = { url, method, params: { with: 'query', params: 42 } }
    const reqWithSearchParams = { url, method, params: new URLSearchParams('with=query&params=42') }

    assert.ok(exclude(config, reqWithQuery))
    assert.ok(exclude(config, reqWithParams))
    assert.ok(exclude(config, reqWithSearchParams))
  })

  it('Should not exclude requests with query parameters with config.exclude.query=false', () => {
    const config = {
      exclude: { query: false, methods },
      debug
    }

    const reqWithQuery = { url: `${url}?with=query&params=42`, method }
    const reqWithParams = { url, method, params: { with: 'query', params: 42 } }
    const reqWithSearchParams = { url, method, params: new URLSearchParams('with=query&params=42') }

    assert.ok(!exclude(config, reqWithQuery))
    assert.ok(!exclude(config, reqWithParams))
    assert.ok(!exclude(config, reqWithSearchParams))
  })

  it('Should exclude requests that match paths', () => {
    const config = {
      exclude: { paths: [/\/users/], methods },
      debug
    }

    assert.ok(exclude(config, { url, method }))
    assert.strictEqual(exclude(config, { url: 'https://some-rest.api/invoices', method }), false)
  })

  it('Should exclude filtered requests', () => {
    const config = {
      exclude: {
        filter: req => req.params && req.params.shouldExclude,
        methods
      },
      debug
    }

    assert.ok(exclude(config, { url, method, params: { shouldExclude: true } }))
    assert.strictEqual(exclude(config, { url, method }), false)
  })
})
