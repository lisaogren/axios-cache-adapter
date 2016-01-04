'use strict'

export default function cache (config = {}) {
  if (!config.store) {
    throw new Error('Cache middleware need to be provided a store.')
  }

  const store = config.store
  const cache = config.cache

  if (!config.cache || typeof config.cache !== 'function') {
    throw new Error('Cache middleware need a cache function.')
  }

  return (req, next, service) => {
    const useCache = !service.use || (service.use && (service.use.cache !== false))

    if (!useCache) {
      return next()
    }

    const value = store.getItem(req.url)

    if (value) {
    }

    const promise = next()
    promise.then(cache)

    return promise
  }
}
