import axios from 'axios'
import settle from 'axios/lib/core/settle'

import partial from 'lodash/partial'

import readCache from './read-cache'
import serialize from './serialize'
import MemoryStore from './memory'
import exclude from './exclude'

function setupCache (config = {}) {
  config.store = config.store || new MemoryStore()
  const key = config.key || setupCache.key

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
    console.log('[cache.request] Starting cache execution', req)

    if (exclude(req, config.exclude)) {
      return null
    }

    const uuid = key(req)

    // clear cache if method different from GET.
    // We should exclude HEAD
    const method = req.method.toLowerCase()

    if (method === 'head') {
      return null
    }

    if (method !== 'get') {
      config.store.removeItem(uuid)
      return null
    }

    return config.store.getItem(uuid).then(value => {
      console.log('[cache.request]', uuid, value)

      const next = partial(response, req, uuid)

      return config.readCache(req, config.log)(value)
        .then(data => {
          console.log('[cache.readCache]', data)

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
    console.log(config)

    return new Promise((resolve, reject) => {
      return request(config)
        .then(response => {
          console.log('[request] Settling', response)

          return settle(resolve, reject, response)
        })
        .catch(response => {
          console.log('[request] Caught cache reading', response)

          return axios.defaults.adapter(config)
            .then(response)
            .then(res => settle(resolve, reject, res))
        })
    })
  }

  return {
    request,
    adapter
  }
}

setupCache.readCache = readCache
setupCache.serialize = serialize

setupCache.key = function (req) {
  return req.url
}

export default setupCache
