import { isString, isFunction } from './utilities'
import md5 from 'md5'

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
  if (isString(config.key)) {
    cacheKey = req => {
      const url = `${req.baseURL ? req.baseURL : ''}${req.url}`
      const key = `${config.key}/${url}${serializeQuery(req)}`
      return req.data ? key + md5(req.data) : key
    }
  } else {
    cacheKey = req => {
      const url = `${req.baseURL ? req.baseURL : ''}${req.url}`
      const key = url + serializeQuery(req)
      return req.data ? key + md5(req.data) : key
    }
  }

  return cacheKey
}

async function defaultInvalidate (config, req) {
  const method = req.method.toLowerCase()
  if (config.exclude.methods.includes(method)) {
    await config.store.removeItem(config.uuid)
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
    Object.keys(req.params).forEach(key => params.append(key, req.params[key]))
  }

  return `?${params.toString()}`
}

export { read, write, key, invalidate, serializeQuery }
export default { read, write, key, invalidate, serializeQuery }
