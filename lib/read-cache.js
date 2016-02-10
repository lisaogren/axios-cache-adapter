import hydrate from './hydrate'

export default function (req) {
  return function (value) {
    return new Promise((resolve, reject) => {
      if (!value) {
        const error = new Error()

        error.reason = 'cache-miss'
        error.message = 'Value not found from cache'
        return reject(error)
      }

      // override request end callback
      req.callback = (err, res) => {

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
