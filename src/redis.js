import map from 'lodash/map'
import get from 'lodash/get'
import { promisify } from 'util'

class RedisStore {
  constructor (client, HASH_KEY = 'axios-cache') {
    if (get(client, 'constructor.name') !== 'RedisClient') {
      throw new Error('Not valid redis client')
    }
    this.client = client
    this.HASH_KEY = HASH_KEY
    this.hgetAsync = promisify(client.hget).bind(client)
    this.hsetAsync = promisify(client.hset).bind(client)
    this.hdelAsync = promisify(client.hdel).bind(client)
    this.delAsync = promisify(client.del).bind(client)
    this.hlenAsync = promisify(client.hlen).bind(client)
    this.hgetallAsync = promisify(client.hgetall).bind(client)
  }
  async getItem (key) {
    const item = (await this.hgetAsync(this.HASH_KEY, key)) || null

    return JSON.parse(item)
  }

  async setItem (key, value) {
    await this.hsetAsync(this.HASH_KEY, key, JSON.stringify(value))
    return value
  }

  async removeItem (key) {
    await this.hdelAsync(this.HASH_KEY, key)
  }

  async clear () {
    await this.delAsync(this.HASH_KEY)
  }

  async length () {
    return this.hlenAsync(this.HASH_KEY)
  }

  async iterate (fn) {
    const hashData = await this.hgetallAsync(this.HASH_KEY)
    return Promise.all(
      map(hashData, (value, key) => fn(value, key))
    )
  }
}

export default RedisStore
