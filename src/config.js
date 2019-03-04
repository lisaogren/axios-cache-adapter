import axios from 'axios'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import MemoryStore from './memory'
import { key, invalidate } from './cache'

const noop = () => {}
const debug = (...args) => console.log('[axios-cache-adapter]', ...args)

const defaults = {
  // Default settings when solely creating the cache adapter with setupCache.
  cache: {
    maxAge: 0,
    limit: false,
    store: null,
    key: null,
    invalidate: null,
    exclude: {
      paths: [],
      query: true,
      filter: null
    },
    adapter: axios.defaults.adapter,
    clearOnStale: true,
    clearOnError: true,
    readOnError: false,
    readHeaders: false,
    debug: false,
    ignoreCache: false
  },

  // Additional defaults when creating the axios instance with the cache adapter.
  axios: {
    cache: {
      maxAge: 15 * 60 * 1000
    }
  }
}

// List of disallowed in the per-request config.
const disallowedPerRequestKeys = ['limit', 'store', 'adapter', 'uuid', 'acceptStale']

/**
 * Make a global config object.
 *
 * @param {Object} [override={}] Optional config override.
 * @return {Object}
 */
const makeConfig = function (override = {}) {
  let config = merge({}, defaults.cache, override)

  // Create a cache key method
  config.key = key(config)
  config.invalidate = invalidate(config)
  // If debug mode is on, create a simple logger method
  if (config.debug !== false) {
    config.debug = typeof config.debug === 'function' ? config.debug : debug
  } else {
    config.debug = noop
  }

  // Create an in memory store if none was given
  if (!config.store) config.store = new MemoryStore()

  config.debug('Global cache config', config)

  return config
}

/**
 * Merge the per-request config in another config.
 *
 * This method exists because not all keys should be allowed as it
 * may lead to unexpected behaviours. For instance, setting another
 * store or adapter per request is wrong, instead another instance
 * axios, or the adapter, should be used.
 *
 * @param {Object} config Config object.
 * @param {Object} req    The current axios request
 * @return {Object}
 */
const mergeRequestConfig = function (config, req) {
  const requestConfig = req.cache
  const mergedConfig = merge({}, config, omit(requestConfig, disallowedPerRequestKeys))

  if (mergedConfig.debug === true) {
    mergedConfig.debug = debug
  }

  // Generate request UUID
  mergedConfig.uuid = config.key(req)

  config.debug(`Request config for ${req.url}`, mergedConfig)

  return mergedConfig
}

export { defaults, makeConfig, mergeRequestConfig }
export default { defaults, makeConfig, mergeRequestConfig }
