import find from 'lodash/find'
import reduce from 'lodash/reduce'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

export const excludeQuery = () => (config, req) => {
  return req.url.match(/\?.*$/) ||
    !isEmpty(req.params) ||
    (
      typeof URLSearchParams !== 'undefined' &&
      req.params instanceof URLSearchParams
    )
}

export const excludePaths = (paths = []) => {
  if (!isArray(paths)) paths = [paths]

  return (config, req) => {
    return find(paths, regexp => req.url.match(regexp))
  }
}

export const excludeHttpMethods = (methods = []) => {
  if (!isArray(methods)) methods = [methods]

  return (config, req) => {
    return find(methods, method => method.toLowerCase() === req.method.toLowerCase())
  }
}

function exclude (config = {}, req) {
  let { exclude: middlewares = [], debug } = config

  if (!isArray(middlewares)) middlewares = [middlewares]

  const shouldExclude = reduce(middlewares, (result, shouldExclude) => {
    if (!result) result = Boolean(shouldExclude(config, req))

    return result
  }, false)

  if (shouldExclude) debug('Excluding request from cache')

  return shouldExclude
}

export default exclude
