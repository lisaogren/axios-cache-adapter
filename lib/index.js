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

    return new Promise((resolve, reject) => {
      store.getItem(key(req))
        .then((value) => {
          read(req)(value)
            .then(resolve)
            .catch(() => {
              // cache miss
              next()
                .then((res) => {
                  resolve(res)
                  store.setItem(key(req), serialize(req, res))
                })
                .catch(reject)
            })
        })
        .catch(reject)
    })
  }
}

cache.readCache = readCache
cache.serialize = serialize

cache.key = function (req) {
  return req.url
}

export default cache
