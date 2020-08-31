import { promisify } from 'util'

class RedisDefaultStore {
  constructor (client, options = {}) {
    const invalidClientError = new TypeError(
      'First parameter must be a valid RedisClient instance.'
    )

    try {
      if (client.constructor.name !== 'RedisClient') {
        throw invalidClientError
      }
    } catch (err) {
      throw invalidClientError
    }
    this.client = client
    this.prefix = options.prefix || 'axios-cache'
    this.maxScanCount = options.maxScanCount || 1000
    this.getAsync = promisify(client.get).bind(client)
    this.psetexAsync = promisify(client.psetex).bind(client)
    this.delAsync = promisify(client.del).bind(client)
    this.scanAsync = promisify(client.scan).bind(client)
  }

  calculateTTL (value) {
    const now = Date.now()

    if (value.expires && value.expires > now) {
      return value.expires - now
    }

    // If there is no expires in value or the provided expire is before the current time

    return -1
  }

  transformKey (key) {
    return this.prefix + '_' + key
  }

  async getItem (key) {
    const item = (await this.getAsync(this.transformKey(key))) || null

    return JSON.parse(item)
  }

  async setItem (key, value) {
    const computedKey = this.transformKey(key)

    const ttl = this.calculateTTL(value)

    if (ttl > 0) {
      await this.psetexAsync(computedKey, ttl, JSON.stringify(value))
    }

    return value
  }

  async removeItem (key) {
    await this.delAsync(this.transformKey(key))
  }

  async scan (operation) {
    let cursor = '0'

    do {
      const reply = await this.scanAsync(cursor, 'MATCH', this.transformKey('*'), 'COUNT', this.maxScanCount)

      cursor = reply[0]

      await operation(reply[1])
    } while (cursor !== '0')
  }

  async clear () {
    await this.scan(keys => this.delAsync(keys))
  }

  async length () {
    let length = 0

    await this.scan(keys => {
      length += keys.length
    })

    return length
  }

  async iterate (fn) {
    async function runFunction (key) {
      const item = (await this.getAsync(key)) || null

      const value = JSON.parse(item)

      return (await fn(value, key))
    }

    await this.scan(keys => Promise.all(keys.map(runFunction.bind(this))))

    return Promise.resolve([])
  }
}

export default RedisDefaultStore
