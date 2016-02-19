'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _readCache = require('./read-cache');

var _readCache2 = _interopRequireDefault(_readCache);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cache() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!config.store) {
    throw new Error('Cache middleware need to be provided a store.');
  }

  var store = config.store;
  var key = config.key || cache.key;

  config.maxAge = config.maxAge || 0;
  config.readCache = config.readCache || _readCache2.default;
  config.serialize = config.serialize || _serialize2.default;

  if (config.log !== false) {
    config.log = typeof config.log === 'function' ? config.log : console.log.bind(console);
  }

  return function (req, next, service) {
    if (service) {
      var useCache = !service.use || service.use && service.use.cache !== false;

      if (!useCache) {
        return null;
      }
    }

    // do not cache request with query
    if (req.url.match(/\?.*$/)) {
      return null;
    }

    var uuid = key(req);

    // clear cache if method different from GET
    if (req.method.toLowerCase() !== 'get') {
      store.removeItem(uuid);
      return null;
    }

    var f = function f() {
      return next().then(function (res) {
        return store.setItem(uuid, {
          expires: config.maxAge === 0 ? 0 : Date.now() + config.maxAge,
          data: config.serialize(req, res)
        });
      });
    };

    return store.getItem(uuid).then(function (value) {
      return config.readCache(req, config.log)(value).catch(function (err) {
        // eslint-disable-line handle-callback-err
        f();
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