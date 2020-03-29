import limit from './limit'
import { write } from './cache'
import { parse } from 'cache-control-esm'

async function response (config, req, res) {
  const { request = {}, headers = {} } = res

  // exclude binary response from cache
  if (['arraybuffer', 'blob'].indexOf(request.responseType) > -1) {
    return res
  }

  let cacheControl = {}

  // Should we try to determine request cache expiration from headers or not
  if (config.readHeaders) {
    if (headers['cache-control']) { // Try parsing `cache-control` header from response
      cacheControl = parse(headers['cache-control'])

      // Force cache exlcusion for `cache-control: no-cache` and `cache-control: no-store`
      if (cacheControl.noCache || cacheControl.noStore) {
        config.excludeFromCache = true
      }
    } else if (headers.expires) { // Else try reading `expires` header
      config.expires = new Date(headers.expires).getTime()
    } else {
      config.expires = new Date().getTime()
    }
  }

  if (!config.excludeFromCache) {
    if (cacheControl.maxAge || cacheControl.maxAge === 0) {
      // Use `cache-control` header `max-age` value and convert to milliseconds
      config.expires = Date.now() + (cacheControl.maxAge * 1000)
    } else if (!config.readHeaders) {
      // Use fixed `maxAge` defined in the global or per-request config
      config.expires = config.maxAge === 0 ? Date.now() : Date.now() + config.maxAge
    }

    // Check if a cache limit has been configured
    if (config.limit) {
      config.debug(`Detected limit: ${config.limit}`)

      await limit(config)
    }

    // Write response to cache
    await write(config, req, res)
  } else {
    // Mark request as excluded from cache
    res.request.excludedFromCache = true
  }

  return res
}

export default response
