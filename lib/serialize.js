export default function serialize (req, res) {
  return {
    headers: res.xhr.getAllResponseHeaders(),
    body: {
      responseType: res.xhr.responseType,
      responseText: res.xhr.responseText,
      status: res.status,
      statusText: res.statusText
    }
  }
}
