const Sequelize = require('sequelize');

class SequelizeCache {
  constructor (config = 'sqlite:cache.sqlite') {
    const sequelize = new Sequelize(config)

    this.items = sequelize.define('items', {
      key: Sequelize.STRING,
      payload: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, {
      indexes: [
        {
          fields: ['key']
        }
      ]
    });
    this.items.sync();
  }

  async getItem (key) {
    const item = await this.items.findOne({where: {key}})
    return item ? JSON.parse(item.payload) : null
  }

  async setItem (key, value) {
    await this.items.create({key, payload: JSON.stringify(value)})
    return value
  }

  async removeItem (key) {
    await this.items.destroy({where: {key}})
  }

  async clear () {
    await this.items.destroy({ truncate: true })
  }

  async length () {
    return await this.items.count();
  }

  iterate (fn) {
    return this.items.findAll().then(item => fn(item.key, item.payload))
  }
}

module.exports = SequelizeCache
