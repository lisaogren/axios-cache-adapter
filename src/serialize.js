function serialize (config, req, res) {
  if (res.data) {
    // FIXME: May be useless as localForage and axios already parse automatically
    try {
      res.data = JSON.parse(res.data)
    } catch (err) {
      config.debug('Could not parse data as JSON', err)
    }
  }

  const { request, config, ...response } = res;
  return response;
}

export default serialize
