import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import map from 'lodash/map'

import serialize from './serialize'

async function write (config, req, res) {
  try {
    const entry = {
      expires: config.expires,
      data: serialize(config, req, res)
    }

    await config.store.setItem(config.uuid, entry)
  } catch (err) {
    config.debug('Could not store response', err)

    if (config.clearOnError) {
      try {
        await config.store.clear()
      } catch (err) {
        config.debug('Could not clear store', err)
      }
    }

    return false
  }

  return true
}

async function read (config, req) {
  const { uuid, ignoreCache } = config

  const entry = await config.store.getItem(uuid)

  if (ignoreCache || !entry || !entry.data) {
    config.debug('cache-miss', req.url)
    const error = new Error()

    error.reason = 'cache-miss'
    error.message = 'Entry not found from cache'

    throw error
  }

  const { expires, data } = entry

  // Do not check for stale cache if offline on client-side
  const offline = typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine

  if (!offline && !config.acceptStale && expires !== 0 && (expires < Date.now())) {
    config.debug('cache-stale', req.url)
    const error = new Error()

    error.reason = 'cache-stale'
    error.message = 'Entry is stale'

    throw error
  }

  config.debug(config.acceptStale ? 'cache-hit-stale' : 'cache-hit', req.url)

  return data
}

function key (config) {
  if (isFunction(config.key)) return config.key

  let cacheKey

  if (isString(config.key)) cacheKey = req => `${config.key}/${req.url}${serializeQuery(req)}`
  else cacheKey = req => req.url + serializeQuery(req)

  return cacheKey
}

async function defaultInvalidate (cfg, req) {
  const method = req.method.toLowerCase()
  if (method !== 'get') {
    await cfg.store.removeItem(cfg.uuid)
  }
}

function invalidate (config = {}) {
  if (isFunction(config.invalidate)) return config.invalidate
  return defaultInvalidate
}

function serializeQuery (req) {
  if (!req.params) return ''

  // Probably server-side, just stringify the object
  if (typeof URLSearchParams === 'undefined') return JSON.stringify(req.params)

  let params = req.params

  const isInstanceOfURLSearchParams = req.params instanceof URLSearchParams

  // Convert to an instance of URLSearchParams so it get serialized the same way
  if (!isInstanceOfURLSearchParams) {
    params = new URLSearchParams()

    // Using lodash/map even though we don't listen to output so we don't have to bundle lodash/forEach
    map(req.params, (value, key) => params.append(key, value))
  }

  return `?${params.toString()}`
}

export { read, write, key, invalidate, serializeQuery }
export default { read, write, key, invalidate, serializeQuery }
