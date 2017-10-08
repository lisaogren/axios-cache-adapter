import omit from 'lodash/omit'

export default function serialize (req, res, log) {
  if (res.data) {
    try {
      res.data = JSON.parse(res.data)
    } catch (e) {
      log('Could not parse data as JSON')
    }
  }

  return omit(res, ['request', 'config'])
}
