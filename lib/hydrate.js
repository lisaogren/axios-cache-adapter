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
export default function response (value) {
  const xhr = value.body || {}
  const headers = value.headers || {}

  xhr.getAllResponseHeaders = function () {
    return headers
  }

  xhr.getResponseHeader = function (header) {
    return headers[header]
  }

  return xhr
}
