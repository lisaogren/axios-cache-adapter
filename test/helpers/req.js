import debug from 'debug'
import response from './response'

const log = debug('request')

class Request {
  constructor () {
    this._items = {}
    this._callback = this.callback
  }

  set (name, value) {
    this._items[name] = value
  }

  error () {
    return this._items.error || null
  }

  response () {
    log('sending response ', this._items.response || response(this) || null)
    return this._items.response || response(this) || null
  }

  callback (err, res) {
    return err ? err : res
  }

  // enable overriding default end callback
  // end (fn) {
  //   this._callback = fn
  // }

  // only emit('end') is mocked
  emit () {
    log('emit')
    this.callback(this.error(), this.response())
  }
}

export default Request
