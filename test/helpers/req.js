import debug from 'debug'
import response from './response';

const log = debug('req')

const req = {
  _items: {},

  set: function (name, value) {
    this._items[name] = value
  },

  error: function () {
    return this._items.error || null
  },

  response: function () {
    return this._items.response || response(this) || null
  },

  callback: function (err, res) {
    return err ? err : res
  },

  end: function (fn) {
    this._callback = fn
  },

  // only emit('end') is mocked
  emit: function () {
    this._callback(this.error(), this.response())
  }
}

export default req
