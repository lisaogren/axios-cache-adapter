export function isObject(value) {
  const type = typeof value
  return value != null && (type == "object" || type == "function")
}

export function getTag(value) {
  if (value == null) {
    return value === undefined ? "[object Undefined]" : "[object Null]"
  }
  return toString.call(value)
}

export function isFunction(value) {
  if (!isObject(value)) {
    return false
  }
  
  const tag = getTag(value)
  return (
    tag == "[object Function]" ||
    tag == "[object AsyncFunction]" ||
    tag == "[object GeneratorFunction]" ||
    tag == "[object Proxy]"
  )
}

export function isString(value) {
  const type = typeof value
  return (
    type == "string" ||
    (type == "object" &&
      value != null &&
      !Array.isArray(value) &&
      getTag(value) == "[object String]")
  )
}
