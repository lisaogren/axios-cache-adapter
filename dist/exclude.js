'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exclude;
function exclude(req, service) {
  var exclusions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (service) {
    if (service.use && service.use.cache === false) {
      return true;
    }
  }

  if (typeof exclusions.filter === 'function' && !exclusions.filter(req)) {
    return true;
  }

  // do not cache request with query
  if (exclusions.query && req.url.match(/\?.*$/)) {
    return true;
  }

  var found = false;
  var paths = exclusions.paths || [];

  paths.forEach(function (regexp) {
    if (req.url.match(regexp)) {
      found = true;
      return found;
    }
  });

  if (found) {
    return true;
  }

  // All rules explained. fo not rewrite regexp.
  return false;
}
module.exports = exports['default'];