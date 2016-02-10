import hydrate from './hydrate'

export default function (req, log) {
  return function (value) {
    return new Promise((resolve, reject) => {
      if (!value) {
        log('cache-miss', req.url)
        const error = new Error()

        error.reason = 'cache-miss'
        error.message = 'Value not found from cache'
        return reject(error)
      }

      // override request end callback
      req.callback = (err, res) => {
        log('cache-hit', req.url)

        if (err) {
          return reject(err, res)
        }

        resolve(res)
      }

      // hydrate pseudo xhr from cached value
      req.xhr = hydrate(value)
      req.emit('end')
    })
  }
}
