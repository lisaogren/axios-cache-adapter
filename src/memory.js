import size from 'lodash/size'
import map from 'lodash/map'

class MemoryStore {
  constructor () {
    this.store = {}
  }

  async getItem (key) {
    return this.store[key] || null
  }

  async setItem (key, value) {
    this.store[key] = value

    return value
  }

  async removeItem (key) {
    delete this.store[key]
  }

  async clear () {
    this.store = {}
  }

  async length () {
    return size(this.store)
  }

  iterate (fn) {
    return Promise.all(
      map(this.store, (value, key) => fn(value, key))
    )
  }
}

export default MemoryStore
