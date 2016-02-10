/**
value should have the following format
{
  body: {
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
  const headers = data.headers || {}
  const xhr = value.body || {}

  xhr.getAllResponseHeaders = function () {
    return headers
  }

  xhr.getResponseHeader = function (header) {
    return headers[header]
  }

  return xhr
}
