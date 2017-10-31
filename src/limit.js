async function limit (config) {
  const length = await config.store.length()

  if (length < config.limit) return

  config.debug(`Current store size: ${length}`)

  let firstItem

  await config.store.iterate((value, key) => {
    if (!firstItem) firstItem = { value, key }
    if (value.expires < firstItem.value.expires) firstItem = { value, key }
  })

  if (firstItem) {
    config.debug(`Removing item: ${firstItem.key}`)

    await config.store.removeItem(firstItem.key)
  }
}

export default limit
