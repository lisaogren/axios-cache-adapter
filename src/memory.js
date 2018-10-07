import size from 'lodash/size'
import map from 'lodash/map'

class MemoryStore {
  constructor () {
    this.store = {}
  }

  async getItem (key) {
    const item = this.store[key] || null

    return JSON.parse(item)
  }

  async setItem (key, value) {
    this.store[key] = JSON.stringify(value)

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
