'use strict'

import readCache from './read-cache'
import serialize from './serialize'

function cache (config = {}) {
  if (!config.store) {
    throw new Error('Cache middleware need to be provided a store.')
  }

  const store = config.store
  const key = config.key || cache.key

  config.readCache = config.readCache || readCache
  config.serialize = config.serialize || serialize

  return (req, next, service) => {
    const useCache = !service.use || (service.use && (service.use.cache !== false))

    if (!useCache) {
      return null
    }

    const f = () => {
      return next()
        .then(res => {
          return store.setItem(key(req), config.serialize(req, res))
        })
    }

    return store.getItem(key(req)).then(value => {
      return config.readCache(req)(value)
        .catch(err => { // eslint-disable-line handle-callback-err
          f()
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
