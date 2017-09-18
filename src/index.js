import axios from 'axios'
import settle from 'axios/lib/core/settle'

import partial from 'lodash/partial'
import extend from 'lodash/extend'

import readCache from './read-cache'
import serialize from './serialize'
import MemoryStore from './memory'
import exclude from './exclude'

function setupCache (config = {}) {
  config.store = config.store || new MemoryStore()
  const key = config.key || getKey

  config.maxAge = config.maxAge || 0
  config.readCache = config.readCache || readCache
  config.serialize = config.serialize || serialize
  config.clearOnStale = config.clearOnStale !== undefined ? config.clearOnStale : true

  config.exclude = config.exclude || {}
  config.exclude.query = config.exclude.query || true
  config.exclude.paths = config.exclude.paths || []
  config.exclude.filter = null

  if (config.log !== false) {
    config.log = typeof config.log === 'function' ? config.log : console.log.bind(console)
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

    return config.store.setItem(uuid, { expires, data: config.serialize(req, res) }).then(() => res)
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
      return config.readCache(req, config.log)(value)
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
        .then(response => settle(resolve, reject, response))
        .catch(response => {
          return axios.defaults.adapter(config)
            .then(response)
            .then(res => settle(resolve, reject, res))
        })
    })
  }

  return {
    adapter,
    readCache,
    serialize
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

  const request = axios.create({
    adapter: cache.adapter
  })

  return request
}

function getKey (req) {
  return req.url
}

export default {
  setupCache,
  setup
}
