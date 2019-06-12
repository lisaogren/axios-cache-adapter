import axios from 'axios'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import isFunction from 'lodash/isFunction'

import request from './request'
import { serializeQuery } from './cache'
import { defaults, makeConfig, mergeRequestConfig } from './config'

/**
 * Configure cache adapter
 *
 * @param   {object} [config={}] Cache adapter options
 * @returns {object} Object containing cache `adapter` and `store`
 */
function setupCache (config = {}) {
  // Extend default configuration
  config = makeConfig(config)

  // Axios adapter. Receives the axios request configuration as only parameter
  async function adapter (req) {
    // Merge the per-request config with the instance config.
    const reqConfig = mergeRequestConfig(config, req)

    // Execute request against local cache
    let res = await request(reqConfig, req)
    let next = res.next

    // Response is not function, something was in cache, return it
    if (!isFunction(next)) return next

    // Nothing in cache so we execute the default adapter or any given adapter
    // Will throw if the request has a status different than 2xx
    let networkError

    try {
      res = await reqConfig.adapter(req)
    } catch (err) {
      networkError = err
    }

    if (networkError) {
      // Check if we should attempt reading stale cache data
      let readOnError = isFunction(reqConfig.readOnError)
        ? reqConfig.readOnError(networkError, req)
        : reqConfig.readOnError

      if (readOnError) {
        try {
          // Force cache tu return stale data
          reqConfig.acceptStale = true

          // Try to read from cache again
          res = await request(reqConfig, req)

          // Signal that data is from stale cache
          res.next.request.stale = true

          // No need to check if `next` is a function just return cache data
          return res.next
        } catch (cacheReadError) {
          // Failed to read stale cache, do nothing here, just let the network error be thrown
        }
      }

      // Re-throw error so that it can be caught in userland if we didn't find any stale cache to read
      throw networkError
    }

    // Process response to store in cache
    return next(res)
  }

  // Return adapter and store instance
  return {
    adapter,
    config,
    store: config.store
  }
}

// ---------------------
// Easy API Setup
// ---------------------

/**
 * Setup an axios instance with the cache adapter pre-configured
 *
 * @param {object} [options={}] Axios and cache adapter options
 * @returns {object} Instance of Axios
 */
function setup (config = {}) {
  config = merge({}, defaults.axios, config)

  const cache = setupCache(config.cache)
  const axiosConfig = omit(config, ['cache'])

  const api = axios.create(
    merge({}, axiosConfig, { adapter: cache.adapter })
  )

  api.cache = cache.store

  return api
}

export { setup, setupCache, serializeQuery }
export default { setup, setupCache, serializeQuery }
