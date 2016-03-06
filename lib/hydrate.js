/**
value should have the following format
{
  body: {
    responseType: '',
    responseText: value,
    status: '',
    statusText: ''
  },
  headers: ''
}
*/

// borrow from superagent
function trim (s = '') {
  return ''.trim ? s.trim(s) : s.replace(/(^\s*|\s*$)/g, '')
}

// borrow from superagent
function parseHeaders (str = '') {
  const lines = str.split(/\r?\n/)
  let fields = {}
  let index
  let line
  let field
  let val

  lines.pop() // trailing CRLF

  for (let i = 0, len = lines.length; i < len; i += 1) {
    line = lines[i]
    index = line.indexOf(':')
    field = line.slice(0, index).toLowerCase()
    val = trim(line.slice(index + 1))
    fields[field] = val
  }

  return fields
}

export default function hydrate (value) {
  const xhr = value.body || {}
  const headers = parseHeaders(value.headers)

  xhr.getAllResponseHeaders = function () {
    return value.headers
  }

  xhr.getResponseHeader = function (header) {
    return headers[header]
  }

  return xhr
}
