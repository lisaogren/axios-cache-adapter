import limit from './limit'
import { write } from './cache'
import { parse } from '@tusbar/cache-control'

async function response (config, req, res) {
  const { request = {}, headers = {} } = res

  // exclude binary response from cache
  if (['arraybuffer', 'blob'].indexOf(request.responseType) > -1) {
    return res
  }

  // Try parsing `cache-control` header from response
  let cacheControl = {}
  if (config.readCacheControl && headers['cache-control']) {
    cacheControl = parse(headers['cache-control'])

    if (cacheControl.noCache || cacheControl.noStore) {
      config.excludeFromCache = true
    }
  }

  if (!config.excludeFromCache) {
    if (cacheControl.maxAge) {
      // Use `cache-control` header `max-age` value and convert to milliseconds
      config.expires = Date.now() + (cacheControl.maxAge * 1000)
    } else {
      config.expires = config.maxAge === 0 ? 0 : Date.now() + config.maxAge
    }

    if (config.limit) {
      config.debug(`Detected limit: ${config.limit}`)

      await limit(config)
    }

    await write(config, req, res)
  } else {
    res.request.excludedFromCache = true
  }

  return res
}

export default response
