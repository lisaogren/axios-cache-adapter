import extend from 'lodash/extend'

import response from './response'
import exclude from './exclude'
import { read } from './cache'

async function request (config, req) {
  const uuid = config.key(req)
  config = extend({}, config, { uuid })

  const next = (...args) => response(config, req, ...args)

  if (exclude(config, req)) {
    return excludeFromCache()
  }

  // clear cache if method different from GET.
  // We should exclude HEAD
  const method = req.method.toLowerCase()

  if (method === 'head') {
    return excludeFromCache()
  }

  if (method !== 'get') {
    await config.store.removeItem(uuid)

    return excludeFromCache()
  }

  try {
    const res = await read(config, req)

    res.config = req
    res.request = { fromCache: true }

    return { config, next: res }
  } catch (err) {
    // clean up cache if stale
    if (config.clearOnStale && err.reason === 'cache-stale') {
      await config.store.removeItem(uuid)
    }

    return { config, next }
  }

  // Helpers

  function excludeFromCache () {
    config.excludeFromCache = true

    return { config, next }
  }
}

export default request
