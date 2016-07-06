'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _readCache = require('./read-cache');

var _readCache2 = _interopRequireDefault(_readCache);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _memory = require('./memory');

var _memory2 = _interopRequireDefault(_memory);

var _exclude = require('./exclude');

var _exclude2 = _interopRequireDefault(_exclude);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cache() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  config.store = config.store || _memory2.default;
  var key = config.key || cache.key;

  config.maxAge = config.maxAge || 0;
  config.readCache = config.readCache || _readCache2.default;
  config.serialize = config.serialize || _serialize2.default;
  config.clearOnStale = config.clearOnStale !== undefined ? config.clearOnStale : true;

  config.exclude = config.exclude || {};
  config.exclude.query = config.exclude.query || true;
  config.exclude.paths = config.exclude.paths || [];
  config.exclude.filter = null;

  if (config.log !== false) {
    config.log = typeof config.log === 'function' ? config.log : console.log.bind(console);
  }

  return function (req, next, service) {
    if ((0, _exclude2.default)(req, service, config.exclude)) {
      return null;
    }

    var uuid = key(req);

    // clear cache if method different from GET.
    // We should exclude HEAD
    var method = req.method.toLowerCase();

    if (method === 'head') {
      return null;
    }

    if (method !== 'get') {
      config.store.removeItem(uuid);
      return null;
    }

    var f = function f() {
      return next().then(function (res) {
        var type = res.status / 100 | 0;

        // only cache 2xx response
        if (type !== 2) {
          return res;
        }

        // exclude binary response from cache
        if (['arraybuffer', 'blob'].indexOf(res.responseType) >= -1) {
          return res;
        }

        return config.store.setItem(uuid, {
          expires: config.maxAge === 0 ? 0 : Date.now() + config.maxAge,
          data: config.serialize(req, res)
        });
      });
    };

    return config.store.getItem(uuid).then(function (value) {
      return config.readCache(req, config.log)(value).catch(function (err) {
        // clean up cache if stale
        config.clearOnStale && err.reason === 'cache-stale' ? config.store.removeItem(uuid).then(f) : f();
      });
    });
  };
}

cache.readCache = _readCache2.default;
cache.serialize = _serialize2.default;

cache.key = function (req) {
  return req.url;
};

exports.default = cache;
module.exports = exports['default'];