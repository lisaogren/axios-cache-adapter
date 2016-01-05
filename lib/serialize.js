
export default function (req, res) {
  return {
    headers: res.headers,
    body: {
      response: res.response,
      responseType: res.responseType,
      responseText: res.responseText,
      status: res.status,
      statusText: res.statusText,
    }
  }
}
