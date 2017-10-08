/* globals test expect */

const axios = require('axios')
const isFunction = require('lodash/isFunction')
const { setup, setupCache } = require('../dist/cache.bundled')

const api = setup({
  cache: {
    debug: true,
    maxAge: 15 * 60 * 1000
  }
})

test('Required lib', () => {
  expect(isFunction(setupCache)).toBeTruthy()
  expect(isFunction(setup)).toBeTruthy()
})

test('Execute GET request', () => {
  const definition = {
    url: 'https://httpbin.org/get',
    method: 'get'
  }

  return api(definition).then(response => {
    const expectedData = expect.objectContaining({})

    expect(response.data.args).toEqual(expectedData)

    return api(definition).then(response => {
      // console.log("TEST NORM",response)
      expect(response.data.args).toEqual(expectedData)
      expect(response.request.fromCache).toBeTruthy()
    })
  })
})

const api2 = setup({
  cache: {
    debug: true,
    maxAge: 15 * 60 * 1000,
    exclude: {
      query: false
    }
  }
})

test('Cache GET requests with params', () => {
  const definition = {
    url: 'https://httpbin.org/get?userId=2',
    method: 'get'
  }

  return api2(definition).then(response => {
    // console.log("TEST PARAMS NOT cached",response)
    const expectedArgsData = expect.objectContaining({"userId": "2"})

    expect(response.data.args).toEqual(expectedArgsData)

    return api2(definition).then(response => {
      // console.log("TEST PARAMS CACHE'D???",response)
      expect(response.data.args).toEqual(expectedArgsData)
      expect(response.request.fromCache).toBeTruthy()
    })
  })
})
