'use strict'

import readCache from './read-cache'
import serialize from './serialize'
import memoryStore from './memory'

function cache (config = {}) {
  const store = config.store || memoryStore
  const key = config.key || cache.key

  if (!store) {
    throw new Error('Cache middleware need to be provided a store.')
  }

  config.maxAge = config.maxAge || 0
  config.readCache = config.readCache || readCache
  config.serialize = config.serialize || serialize

  config.exclude = config.exclude || []

  if (config.log !== false) {
    config.log = typeof config.log === 'function' ? config.log : console.log.bind(console)
  }

  return (req, next, service) => {
    if (service) {
      const useCache = !service.use || (service.use && (service.use.cache !== false))

      if (!useCache) {
        return null
      }
    }

    // do not cache request with query
    if (req.url.match(/\?.*$/)) {
      return null
    }

    let found = false

    config.exclude.forEach(regexp => {
      if (req.url.match(regexp)) {
        found = true
        return false
      }
    })

    if (found) {
      return null
    }

    const uuid = key(req)

    // clear cache if method different from GET
    if (req.method.toLowerCase() !== 'get') {
      store.removeItem(uuid)
      return null
    }

    const f = () => {
      return next()
        .then(res => {
          return store.setItem(uuid, {
            expires: config.maxAge === 0 ? 0 : Date.now() + config.maxAge,
            data: config.serialize(req, res)
          })
        })
    }

    return store.getItem(uuid).then(value => {
      return config.readCache(req, config.log)(value)
        .catch(err => {
          // clean up cache if stale
          err.reason === 'cache-stale' ? store.removeItem(uuid).then(f) : f()
        })
    })
  }
}

cache.readCache = readCache
cache.serialize = serialize

cache.key = function (req) {
  return req.url
}

export default cache
