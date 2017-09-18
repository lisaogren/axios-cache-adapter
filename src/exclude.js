export default function exclude (req, exclusions = {}) {
  if ((typeof exclusions.filter === 'function') && !exclusions.filter(req)) {
    return true
  }

  // do not cache request with query
  if (exclusions.query && req.url.match(/\?.*$/)) {
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
    return true
  }

  // All rules explained. fo not rewrite regexp.
  return false
}
