import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'

function createCacheKey (config) {
  if (isFunction(config.key)) return config.key

  let cacheKey

  if (isString(config.key)) cacheKey = req => `${config.key}/${req.url}`
  else cacheKey = req => req.url

  return cacheKey
}

export default createCacheKey
