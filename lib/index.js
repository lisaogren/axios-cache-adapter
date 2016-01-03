'use strict'

export default function cache (config = {}) {
  if (!config.store) {
    throw new Error('Cache middleware need to be provided a store.');
  }

  const store = config.store;

  if (!store.cache || typeof store.cache !== 'function') {
    throw new Error('Store does not have a cache function.');
  }

  return (req, next, service) => {
    return next()
      .then(store.cacheFn);
  }
}
