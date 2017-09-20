import omit from 'lodash-es/omit'

export default function serialize (req, res) {
  return omit(res, ['request', 'config'])
}
