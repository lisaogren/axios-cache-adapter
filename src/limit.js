function applyLimit (config) {
  return config.store.length().then(length => {
    config.debug(`Current store size: ${length}`)

    if (length >= config.limit) {
      config.debug(`Finding first cached item`)

      let firstItem

      return config.store.iterate((value, key) => {
        if (!firstItem) firstItem = { value, key }
        if (value.expires < firstItem.value.expires) firstItem = { value, key }
      }).then(() => {
        if (firstItem) {
          config.debug(`Found item: ${firstItem.key}`)

          return config.store.removeItem(firstItem.key)
        }
      })
    }
  })
}

export default applyLimit
