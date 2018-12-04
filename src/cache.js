import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'

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
  const { uuid } = config

  const entry = await config.store.getItem(uuid)

  if (!entry || !entry.data) {
    config.debug('cache-miss', req.url)
    const error = new Error()

    error.reason = 'cache-miss'
    error.message = 'Entry not found from cache'

    throw error
  }

  const { expires, data } = entry

  // Do not check for stale cache if offline on client-side
  const offline = typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine

  if (!offline && expires !== 0 && (expires < Date.now())) {
    config.debug('cache-stale', req.url)
    const error = new Error()

    error.reason = 'cache-stale'
    error.message = 'Entry is stale'

    throw error
  }

  config.debug('cache-hit', req.url)

  return data
}

function key (config) {
  if (isFunction(config.key)) return config.key

  let cacheKey

  if (isString(config.key)) cacheKey = req => `${config.key}/${req.url}`
  else cacheKey = req => req.url

  return cacheKey
}

function invalidate (config = {}) {
  if (isFunction(config.invalidate)) return config.invalidate

  return async (cfg, req) => {
    const uuid = cfg.key(req)
    const method = req.method.toLowerCase()
    if (method !== 'get') {
      await cfg.store.removeItem(uuid)
    }
  }
}

export { read, write, key, invalidate }
export default { read, write, key, invalidate }
