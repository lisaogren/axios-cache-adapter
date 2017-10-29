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

  if (expires !== 0 && (expires < Date.now())) {
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

export { read, write, key }
export default { read, write, key }
