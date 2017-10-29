import serialize from './serialize'

async function write (config, req, res) {
  try {
    const entry = {
      expires: config.expires,
      data: serialize(config, req, res)
    }

    await config.store.setItem(config.uuid, entry)
  } catch (err) {
    config.debug('Could not store response', err)

    try {
      await config.store.clear()
    } catch (err) {
      config.debug('Could not clear store', err)
    }

    return false
  }

  return true
}

async function read (config, req) {
  const { uuid } = config

  const entry = await config.store.getItem(uuid)

  if (!entry || !entry.data) {
    config.debug('cache-miss', req.url)
    const error = new Error()

    error.reason = 'cache-miss'
    error.message = 'Entry not found from cache'

    throw error
  }

  const { expires, data } = entry

  if (expires !== 0 && (expires < Date.now())) {
    config.debug('cache-stale', req.url)
    const error = new Error()

    error.reason = 'cache-stale'
    error.message = 'Entry is stale'

    throw error
  }

  config.debug('cache-hit', req.url)

  return data
}

export { read, write }
export default { read, write }
