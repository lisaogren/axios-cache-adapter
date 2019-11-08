import { mapObject } from './utilities'

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
    return Object.keys(this.store).length
  }

  iterate (fn) {
    return Promise.all(mapObject(this.store, fn))
  }
}

export default MemoryStore
