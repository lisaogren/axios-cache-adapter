import isEmpty from 'lodash/isEmpty'

export default function exclude (req, exclusions = {}, log) {
  if ((typeof exclusions.filter === 'function') && !exclusions.filter(req)) {
    log(`Excluding request by filter ${req.url}`)
    return true
  }

  // do not cache request with query
  const hasQueryParams = req.url.match(/\?.*$/) || !isEmpty(req.params)
  if (exclusions.query && hasQueryParams) {
    log(`Excluding request by query ${req.url}`)
    return true
  }

  let found = false
  const paths = exclusions.paths || []

  paths.forEach(regexp => {
    if (req.url.match(regexp)) {
      found = true
      return found
    }
  })

  if (found) {
    log(`Excluding request by url match ${req.url}`)
    return true
  }

  // All rules explained. fo not rewrite regexp.
  return false
}
