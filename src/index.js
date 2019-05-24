import axios from 'axios'
import omit from 'lodash/omit'
import merge from 'lodash/merge'

import { makeAdapter } from './adapter'
import { serializeQuery } from './cache'
import { excludeQuery, excludePaths } from './exclude'
import { defaults, makeConfig } from './config'

/**
 * Configure cache adapter
 *
 * @param   {object} [config={}] Cache adapter options
 * @returns {object} Object containing cache `adapter` and `store`
 */
function setupCache (config = {}) {
  // Extend default configuration
  config = makeConfig(config)

  // Get Axios adapter
  const adapter = makeAdapter(config)

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

export { setup, setupCache, serializeQuery, excludeQuery, excludePaths }
export default { setup, setupCache, serializeQuery, excludeQuery, excludePaths }
