/**
value should have the following format
{
  body: {
    response: '',
    responseType: '',
    responseText: value,
    status: '',
    statusText: ''
  },
  headers: {
    // map of HTTP response headers
  }
}
*/
export default function hydrate (value) {
  const data = JSON.parse(value)
  const xhr = data.body || {}
  const headers = data.headers || {}

  xhr.getAllResponseHeaders = function () {
    return headers
  }

  xhr.getResponseHeader = function (header) {
    return headers[header]
  }

  return xhr
}
