'use strict'

import readCache from './read-cache'
import serialize from './serialize'
import memoryStore from './memory'

function cache (config = {}) {
  config.store = config.store || memoryStore
  const key = config.key || cache.key

  config.maxAge = config.maxAge || 0
  config.readCache = config.readCache || readCache
  config.serialize = config.serialize || serialize

  config.exclude = config.exclude || {}
  config.exclude.query = config.exclude.query || true
  config.exclude.paths = config.exclude.paths || []

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
    if (config.exclude.query && req.url.match(/\?.*$/)) {
      return null
    }

    let found = false

    config.exclude.paths.forEach(regexp => {
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
      config.store.removeItem(uuid)
      return null
    }

    const f = () => {
      return next()
        .then(res => {
          return config.store.setItem(uuid, {
            expires: config.maxAge === 0 ? 0 : Date.now() + config.maxAge,
            data: config.serialize(req, res)
          })
        })
    }

    return config.store.getItem(uuid).then(value => {
      return config.readCache(req, config.log)(value)
        .catch(err => {
          // clean up cache if stale
          err.reason === 'cache-stale' ? config.store.removeItem(uuid).then(f) : f()
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
