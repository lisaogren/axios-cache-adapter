import axios from 'axios'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import isFunction from 'lodash/isFunction'

import { key } from './cache'
import MemoryStore from './memory'
import request from './request'

// ---------------------
// Cache Adapter
// ---------------------

const defaultConfig = {
  maxAge: 0,
  limit: false,
  clearOnStale: true,
  store: null,
  exclude: {
    paths: [],
    query: true,
    filter: null
  },
  adapter: axios.defaults.adapter,
  debug: false
}

function setupCache (config = {}) {
  config = merge({}, defaultConfig, config)

  config.key = key(config)

  if (config.debug !== false) {
    config.debug = (typeof config.debug === 'function')
      ? config.debug
      : (...args) => console.log('[axios-cache-adapter]', ...args)
  } else {
    config.debug = () => {}
  }

  if (!config.store) config.store = new MemoryStore()

  async function adapter (req) {
    const next = await request(config, req)

    if (!isFunction(next)) return next

    const res = await config.adapter(req)

    return next(res)
  }

  return {
    adapter,
    store: config.store
  }
}

// ---------------------
// Easy API Setup
// ---------------------

const defaultOptions = {
  cache: {
    maxAge: 15 * 60 * 1000
  }
}

function setup (options = {}) {
  options = merge({}, defaultOptions, options)

  const cache = setupCache(options.cache)
  const axiosOptions = omit(options, ['cache'])

  const api = axios.create(
    merge({}, axiosOptions, { adapter: cache.adapter })
  )

  api.cache = cache.store

  return api
}

export { setup, setupCache }
export default { setup, setupCache }
