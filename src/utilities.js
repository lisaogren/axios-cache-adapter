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
  console.log(5345345)
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
  console.log(22)
  const type = typeof value
  return (
    type == "string" ||
    (type == "object" &&
      value != null &&
      !Array.isArray(value) &&
      getTag(value) == "[object String]")
  )
}

export function isEmpty (obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;
}

export function get (obj, path, defaultValue) {
  const result = String.prototype.split.call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((res, key) => (res !== null && res !== undefined) ? res[key] : res, obj);
  return (result === undefined || result === obj) ? defaultValue : result;
}
