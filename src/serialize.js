import omit from 'lodash/omit'

export default function serialize (req, res) {
  return omit(res, ['request', 'config'])
}
