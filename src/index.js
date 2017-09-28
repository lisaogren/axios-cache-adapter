import axios from 'axios'

import partial from 'lodash-es/partial'
import extend from 'lodash-es/extend'
import omit from 'lodash-es/omit'

import readCache from './read-cache'
import serialize from './serialize'
import MemoryStore from './memory'
import exclude from './exclude'

function setupCache (config = {}) {
  config.store = config.store || new MemoryStore()
  const key = config.key || (req => req.url)

  config.maxAge = config.maxAge || 0
  config.readCache = config.readCache || readCache
  config.serialize = config.serialize || serialize
  config.clearOnStale = config.clearOnStale !== undefined ? config.clearOnStale : true
  config.debug = config.debug || false

  config.exclude = config.exclude || {}
  config.exclude.query = config.exclude.query || true
  config.exclude.paths = config.exclude.paths || []
  config.exclude.filter = config.exclude.filter || null

  if (config.debug !== false) {
    config.debug = (typeof config.debug === 'function')
      ? config.debug
      : (...args) => console.log('[axios-cache-adapter]', ...args)
  } else {
    config.debug = () => {}
  }

  function response (req, uuid, res) {
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

    return config.store.setItem(uuid, { expires, data: config.serialize(req, res, config.debug) }).then(() => res)
  }

  function request (req) {
    const uuid = key(req)
    const next = partial(response, req, uuid)

    if (exclude(req, config.exclude)) {
      return Promise.reject(next)
    }

    // clear cache if method different from GET.
    // We should exclude HEAD
    const method = req.method.toLowerCase()

    if (method === 'head') {
      return Promise.reject(next)
    }

    if (method !== 'get') {
      config.store.removeItem(uuid)
      return Promise.reject(next)
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
            return config.store.removeItem(uuid)
              .then(() => Promise.reject(next))
          }

          return Promise.reject(next)
        })
    })
  }

  function adapter (config) {
    return new Promise((resolve, reject) => {
      return request(config)
        .then(response => resolve(response))
        .catch(response => {
          return axios.defaults.adapter(config)
            .then(response)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
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

  request.cache = cache

  return request
}

const lib = {
  setupCache,
  setup
}

export default lib
module.exports = lib
