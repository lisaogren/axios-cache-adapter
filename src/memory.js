import size from 'lodash/size'
import map from 'lodash/map'

class MemoryStore {
  constructor () {
    this.store = {}
  }

  getItem (key) {
    return Promise.resolve(this.store[key] || null)
  }

  setItem (key, value) {
    this.store[key] = value
    return Promise.resolve(value)
  }

  removeItem (key) {
    delete this.store[key]
    return Promise.resolve()
  }

  clear () {
    this.store = {}
    return Promise.resolve()
  }

  length () {
    return Promise.resolve(size(this.store))
  }

  iterate (fn) {
    return Promise.all(
      map(this.store, (value, key) => fn(value, key))
    )
  }
}

export default MemoryStore
