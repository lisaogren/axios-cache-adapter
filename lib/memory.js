class MemoryStore {
  constructor () {
    this._store = {}
  }

  getItem (key) {
    return this._store[key] || null
  }

  setItem (key, value) {
    this._store[key] = value
    return this
  }

  clear () {
    this._store = {}
    return this
  }
}

export default MemoryStore;
