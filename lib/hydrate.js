import response from './response'

export default function (req) {
  return function (value) {
    return new Promise((resolve, reject) => {
      // override request end callback
      req.end((err, res) => {
        const callback = req.callback // main callback

        if (err) {
          return reject(callback(err, res))
        }

        resolve(callback(null, res))
      })

      // hydrate pseudo xhr from cached value
      req.xhr = response(value)
      req.emit('end')
    })
  }
}
