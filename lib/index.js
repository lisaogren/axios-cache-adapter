'use strict'

import readCache from './read-cache'
import serialize from './serialize'

function cache (config = {}) {
  if (!config.store) {
    throw new Error('Cache middleware need to be provided a store.')
  }

  const store = config.store
  const key = config.key || cache.key
  const read = config.readCache || readCache
  const serialize = config.serialize || serialize

  return (req, next, service) => {
    const useCache = !service.use || (service.use && (service.use.cache !== false))

    if (!useCache) {
      return next()
    }

    return store.getItem(key(req))
      .then(read(req))
      .catch((err) => {
        // cache miss
        const promise = next()
        promise.then((req, res) => {
          store.setItem(key(req), serialize(req, res))
        })

        return promise
      })
  }
}

cache.readCache = readCache
cache.serialize = serialize

cache.key = function (req) {
  return req.url
}

export default cache
