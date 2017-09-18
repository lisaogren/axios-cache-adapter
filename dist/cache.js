(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios'), require('axios/lib/core/settle'), require('lodash/partial'), require('lodash/extend'), require('lodash/omit')) :
	typeof define === 'function' && define.amd ? define(['axios', 'axios/lib/core/settle', 'lodash/partial', 'lodash/extend', 'lodash/omit'], factory) :
	(global.axiosCacheAdapter = factory(global.axios,global.settle,global.partial,global.extend,global.omit));
}(this, (function (axios,settle,partial,extend,omit) { 'use strict';

axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
settle = settle && settle.hasOwnProperty('default') ? settle['default'] : settle;
partial = partial && partial.hasOwnProperty('default') ? partial['default'] : partial;
extend = extend && extend.hasOwnProperty('default') ? extend['default'] : extend;
omit = omit && omit.hasOwnProperty('default') ? omit['default'] : omit;

// import hydrate from './hydrate'

var readCache = function (req, log) {
  return function (value) {
    return new Promise(function (resolve, reject) {
      if (!value || !value.data) {
        log('cache-miss', req.url);
        var error = new Error();

        error.reason = 'cache-miss';
        error.message = 'Value not found from cache';
        return reject(error)
      }

      var expires = value.expires;
      var data = value.data;

      if (expires !== 0 && (expires < Date.now())) {
        log('cache-stale', req.url);
        var error$1 = new Error();

        error$1.reason = 'cache-stale';
        error$1.message = 'Value is stale';
        return reject(error$1)
      }

      // // hydrate pseudo xhr from cached value
      // req.xhr = hydrate(data)
      //
      // // override request end callback
      // req.callback = (err, res) => {
      //   log('cache-hit', req.url)
      //
      //   if (err) {
      //     return reject(err, res)
      //   }
      //
      //   resolve(res)
      // }

      log('cache-hit', req.url);

      return resolve(data)
    })
  }
};

function serialize (req, res) {
  return omit(res, ['request', 'config'])
}

var MemoryStore = function MemoryStore () {
  this._store = {};
};

MemoryStore.prototype.getItem = function getItem (key) {
  return Promise.resolve(this._store[key] || null)
};

MemoryStore.prototype.setItem = function setItem (key, value) {
  this._store[key] = value;
  return Promise.resolve(value)
};

MemoryStore.prototype.clear = function clear () {
  this._store = {};
  return Promise.resolve()
};

function exclude (req, exclusions) {
  if ( exclusions === void 0 ) exclusions = {};

  if ((typeof exclusions.filter === 'function') && !exclusions.filter(req)) {
    return true
  }

  // do not cache request with query
  if (exclusions.query && req.url.match(/\?.*$/)) {
    return true
  }

  var found = false;
  var paths = exclusions.paths || [];

  paths.forEach(function (regexp) {
    if (req.url.match(regexp)) {
      found = true;
      return found
    }
  });

  if (found) {
    return true
  }

  // All rules explained. fo not rewrite regexp.
  return false
}

function setupCache (config) {
  if ( config === void 0 ) config = {};

  config.store = config.store || new MemoryStore();
  var key = config.key || (function (req) { return req.url; });

  config.maxAge = config.maxAge || 0;
  config.readCache = config.readCache || readCache;
  config.serialize = config.serialize || serialize;
  config.clearOnStale = config.clearOnStale !== undefined ? config.clearOnStale : true;
  config.debug = config.debug || false;

  config.exclude = config.exclude || {};
  config.exclude.query = config.exclude.query || true;
  config.exclude.paths = config.exclude.paths || [];
  config.exclude.filter = config.exclude.filter || null;

  if (config.debug !== false) {
    config.debug = typeof config.debug === 'function' ? config.debug : console.log.bind(console);
  }

  function response (req, uuid, res) {
    var type = res.status / 100 | 0;

    // only cache 2xx response
    if (type !== 2) {
      return res
    }

    // exclude binary response from cache
    if (['arraybuffer', 'blob'].indexOf(res.responseType) > -1) {
      return res
    }

    var expires = config.maxAge === 0 ? 0 : Date.now() + config.maxAge;

    return config.store.setItem(uuid, { expires: expires, data: config.serialize(req, res) }).then(function () { return res; })
  }

  function request (req) {
    var uuid = key(req);
    var next = partial(response, req, uuid);

    if (exclude(req, config.exclude)) {
      return Promise.reject(next)
    }

    // clear cache if method different from GET.
    // We should exclude HEAD
    var method = req.method.toLowerCase();

    if (method === 'head') {
      return Promise.reject(next)
    }

    if (method !== 'get') {
      config.store.removeItem(uuid);
      return Promise.reject(next)
    }

    return config.store.getItem(uuid).then(function (value) {
      return config.readCache(req, config.debug)(value)
        .then(function (data) {
          data.config = req;
          data.request = { fromCache: true };

          return data
        })
        .catch(function (err) {
          // clean up cache if stale
          if (config.clearOnStale && err.reason === 'cache-stale') {
            return config.store.removeItem(uuid)
              .then(function () { return Promise.reject(next); })
          }

          return Promise.reject(next)
        })
    })
  }

  function adapter (config) {
    return new Promise(function (resolve, reject) {
      return request(config)
        .then(function (response) { return settle(resolve, reject, response); })
        .catch(function (response) {
          return axios.defaults.adapter(config)
            .then(response)
            .then(function (res) { return settle(resolve, reject, res); })
        })
    })
  }

  return {
    adapter: adapter,
    store: config.store
  }
}

var defaultOptions = {
  cache: {
    maxAge: 15 * 60 * 1000
  }
};

function setup (options) {
  options = extend({}, defaultOptions, options);

  var cache = setupCache(options.cache);
  var axiosOptions = omit(options, ['cache']);

  var request = axios.create(extend({}, axiosOptions, { adapter: cache.adapter }));

  return request
}

var index = {
  setupCache: setupCache,
  setup: setup
};

return index;

})));
