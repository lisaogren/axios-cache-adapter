class MemoryStore {
  constructor () {
    this._store = {}
  }

  getItem (key) {
    return Promise.resolve(this._store[key] || null)
  }

  setItem (key, value) {
    this._store[key] = value
    return Promise.resolve(value)
  }

  clear () {
    this._store = {}
    return Promise.resolve()
  }
}

export default MemoryStore
