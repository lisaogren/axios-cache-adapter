// import hydrate from './hydrate'

export default function (req, log) {
  return function (value) {
    return new Promise((resolve, reject) => {
      if (!value || !value.data) {
        log('cache-miss', req.url)
        const error = new Error()

        error.reason = 'cache-miss'
        error.message = 'Value not found from cache'
        return reject(error)
      }

      const { expires, data } = value

      if (expires !== 0 && (expires < Date.now())) {
        log('cache-stale', req.url)
        const error = new Error()

        error.reason = 'cache-stale'
        error.message = 'Value is stale'
        return reject(error)
      }

      // // hydrate pseudo xhr from cached value
      // req.xhr = hydrate(data)
      //
      // // override request end callback
      // req.callback = (err, res) => {
      //   log('cache-hit', req.url)
      //
      //   if (err) {
      //     return reject(err, res)
      //   }
      //
      //   resolve(res)
      // }

      log('cache-hit', req.url)

      return resolve(data)
    })
  }
}
