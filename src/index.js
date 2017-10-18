import axios from 'axios'

import isFunction from 'lodash/isFunction'
import extend from 'lodash/extend'
import omit from 'lodash/omit'

import readCache from './read-cache'
import serialize from './serialize'
import MemoryStore from './memory'
import exclude from './exclude'
import createKey from './cache-key'
import applyLimit from './limit'

function setupCache (config = {}) {
  const cacheKey = createKey(config)

  config.store = config.store || new MemoryStore()
  config.maxAge = config.maxAge || 0
  config.limit = config.limit || false
  config.readCache = config.readCache || readCache
  config.serialize = config.serialize || serialize
  config.clearOnStale = config.clearOnStale !== undefined ? config.clearOnStale : true
  config.debug = config.debug || false

  config.exclude = config.exclude || {}
  config.exclude.query = config.exclude.query !== undefined ? config.exclude.query : true
  config.exclude.paths = config.exclude.paths || []
  config.exclude.filter = config.exclude.filter || null

  if (config.debug !== false) {
    config.debug = (typeof config.debug === 'function')
      ? config.debug
      : (...args) => console.log('[axios-cache-adapter]', ...args)
  } else {
    config.debug = () => {}
  }

  function response (exclude, req, uuid, res) {
    const type = res.status / 100 | 0

    // only cache 2xx response
    if (type !== 2) {
      return res
    }

    // exclude binary response from cache
    if (['arraybuffer', 'blob'].indexOf(res.responseType) > -1) {
      return res
    }

    let expires = config.maxAge === 0 ? 0 : Date.now() + config.maxAge

    if (!exclude) {
      if (config.limit) {
        config.debug(`Detected limit: ${config.limit}`)

        return applyLimit(config).then(
          () => store(uuid, expires, req, res)
        )
      }

      return store(uuid, expires, req, res)
    }

    return res
  }

  function store (uuid, expires, req, res) {
    return config.store
      .setItem(uuid, { expires, data: config.serialize(req, res, config.debug) })
      .then(() => res)
  }

  function request (req) {
    const uuid = cacheKey(req)
    const next = (exclude, ...args) => response(exclude, req, uuid, ...args)
    const includedNext = (...args) => next(false, ...args)
    const excludedNext = (...args) => next(true, ...args)

    if (exclude(req, config.exclude, config.debug)) {
      return Promise.resolve(excludedNext)
    }

    // clear cache if method different from GET.
    // We should exclude HEAD
    const method = req.method.toLowerCase()

    if (method === 'head') {
      return Promise.resolve(excludedNext)
    }

    if (method !== 'get') {
      return config.store.removeItem(uuid).then(() => excludedNext)
    }

    return config.store.getItem(uuid).then(value => {
      return config.readCache(req, config.debug)(value)
        .then(data => {
          data.config = req
          data.request = { fromCache: true }

          return data
        })
        .catch(err => {
          // clean up cache if stale
          if (config.clearOnStale && err.reason === 'cache-stale') {
            return config.store.removeItem(uuid).then(() => includedNext)
          }

          return includedNext
        })
    })
  }

  function adapter (config) {
    return request(config)
      .then(response => {
        if (!isFunction(response)) return response

        return axios.defaults.adapter(config).then(response)
      })
  }

  return {
    adapter,
    store: config.store
  }
}

const defaultOptions = {
  cache: {
    maxAge: 15 * 60 * 1000
  }
}

function setup (options) {
  options = extend({}, defaultOptions, options)

  const cache = setupCache(options.cache)
  const axiosOptions = omit(options, ['cache'])

  const request = axios.create(extend({}, axiosOptions, { adapter: cache.adapter }))

  request.cache = cache.store

  return request
}

const lib = {
  setupCache,
  setup
}

export default lib
module.exports = lib
