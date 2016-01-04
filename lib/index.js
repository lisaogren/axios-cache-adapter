'use strict'

import readCache from './read-cache'
export default function cache (config = {}) {
  if (!config.store) {
    throw new Error('Cache middleware need to be provided a store.')
  }

  const store = config.store
  const cache = config.cache

  if (!config.cache || typeof config.cache !== 'function') {
    throw new Error('Cache middleware need a cache function.')
  }

  const read = config.readCache || readCache
  return (req, next, service) => {
    const useCache = !service.use || (service.use && (service.use.cache !== false))

    if (!useCache) {
      return next()
    }

    return store.getItem(req.url)
      .then(read(req))
      .catch((err) => {
        const promise = next()

        return promise
      })
  }
}
