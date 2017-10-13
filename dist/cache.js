(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/isFunction"), require("lodash/omit"), require("axios"), require("lodash/extend"), require("lodash/size"), require("lodash/map"), require("lodash/isString"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/isFunction", "lodash/omit", "axios", "lodash/extend", "lodash/size", "lodash/map", "lodash/isString"], factory);
	else if(typeof exports === 'object')
		exports["axiosCacheAdapter"] = factory(require("lodash/isFunction"), require("lodash/omit"), require("axios"), require("lodash/extend"), require("lodash/size"), require("lodash/map"), require("lodash/isString"));
	else
		root["axiosCacheAdapter"] = factory(root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_12__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = __webpack_require__(3);

var _axios2 = _interopRequireDefault(_axios);

var _isFunction = __webpack_require__(0);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _extend = __webpack_require__(4);

var _extend2 = _interopRequireDefault(_extend);

var _omit = __webpack_require__(1);

var _omit2 = _interopRequireDefault(_omit);

var _readCache = __webpack_require__(5);

var _readCache2 = _interopRequireDefault(_readCache);

var _serialize = __webpack_require__(6);

var _serialize2 = _interopRequireDefault(_serialize);

var _memory = __webpack_require__(7);

var _memory2 = _interopRequireDefault(_memory);

var _exclude = __webpack_require__(10);

var _exclude2 = _interopRequireDefault(_exclude);

var _cacheKey = __webpack_require__(11);

var _cacheKey2 = _interopRequireDefault(_cacheKey);

var _limit = __webpack_require__(13);

var _limit2 = _interopRequireDefault(_limit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupCache() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var cacheKey = (0, _cacheKey2.default)(config);

  config.store = config.store || new _memory2.default();
  config.maxAge = config.maxAge || 0;
  config.limit = config.limit || false;
  config.readCache = config.readCache || _readCache2.default;
  config.serialize = config.serialize || _serialize2.default;
  config.clearOnStale = config.clearOnStale !== undefined ? config.clearOnStale : true;
  config.debug = config.debug || false;

  config.exclude = config.exclude || {};
  config.exclude.query = config.exclude.query !== undefined ? config.exclude.query : true;
  config.exclude.paths = config.exclude.paths || [];
  config.exclude.filter = config.exclude.filter || null;

  if (config.debug !== false) {
    config.debug = typeof config.debug === 'function' ? config.debug : function () {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_console = console).log.apply(_console, ['[axios-cache-adapter]'].concat(args));
    };
  } else {
    config.debug = function () {};
  }

  function response(exclude, req, uuid, res) {
    var type = res.status / 100 | 0;

    // only cache 2xx response
    if (type !== 2) {
      return res;
    }

    // exclude binary response from cache
    if (['arraybuffer', 'blob'].indexOf(res.responseType) > -1) {
      return res;
    }

    var expires = config.maxAge === 0 ? 0 : Date.now() + config.maxAge;

    if (!exclude) {
      if (config.limit) {
        config.debug('Detected limit: ' + config.limit);

        return (0, _limit2.default)(config).then(function () {
          return store(uuid, expires, req, res);
        });
      }

      return store(uuid, expires, req, res);
    }

    return res;
  }

  function store(uuid, expires, req, res) {
    return config.store.setItem(uuid, { expires: expires, data: config.serialize(req, res, config.debug) }).then(function () {
      return res;
    });
  }

  function request(req) {
    var uuid = cacheKey(req);
    var next = function next(exclude) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return response.apply(undefined, [exclude, req, uuid].concat(args));
    };
    var includedNext = function includedNext() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return next.apply(undefined, [false].concat(args));
    };
    var excludedNext = function excludedNext() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return next.apply(undefined, [true].concat(args));
    };

    if ((0, _exclude2.default)(req, config.exclude)) {
      return Promise.resolve(excludedNext);
    }

    // clear cache if method different from GET.
    // We should exclude HEAD
    var method = req.method.toLowerCase();

    if (method === 'head') {
      return Promise.resolve(excludedNext);
    }

    if (method !== 'get') {
      return config.store.removeItem(uuid).then(function () {
        return excludedNext;
      });
    }

    return config.store.getItem(uuid).then(function (value) {
      return config.readCache(req, config.debug)(value).then(function (data) {
        data.config = req;
        data.request = { fromCache: true };

        return data;
      }).catch(function (err) {
        // clean up cache if stale
        if (config.clearOnStale && err.reason === 'cache-stale') {
          return config.store.removeItem(uuid).then(function () {
            return includedNext;
          });
        }

        return includedNext;
      });
    });
  }

  function adapter(config) {
    return request(config).then(function (response) {
      if (!(0, _isFunction2.default)(response)) return response;

      return _axios2.default.defaults.adapter(config).then(response);
    });
  }

  return {
    adapter: adapter,
    store: config.store
  };
}

var defaultOptions = {
  cache: {
    maxAge: 15 * 60 * 1000
  }
};

function setup(options) {
  options = (0, _extend2.default)({}, defaultOptions, options);

  var cache = setupCache(options.cache);
  var axiosOptions = (0, _omit2.default)(options, ['cache']);

  var request = _axios2.default.create((0, _extend2.default)({}, axiosOptions, { adapter: cache.adapter }));

  request.cache = cache.store;

  return request;
}

var lib = {
  setupCache: setupCache,
  setup: setup
};

exports.default = lib;

module.exports = lib;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, log) {
  return function (value) {
    return new Promise(function (resolve, reject) {
      if (!value || !value.data) {
        log('cache-miss', req.url);
        var error = new Error();

        error.reason = 'cache-miss';
        error.message = 'Value not found from cache';
        return reject(error);
      }

      var expires = value.expires,
          data = value.data;


      if (expires !== 0 && expires < Date.now()) {
        log('cache-stale', req.url);
        var _error = new Error();

        _error.reason = 'cache-stale';
        _error.message = 'Value is stale';
        return reject(_error);
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

      return resolve(data);
    });
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serialize;

var _omit = __webpack_require__(1);

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serialize(req, res, log) {
  if (res.data) {
    try {
      res.data = JSON.parse(res.data);
    } catch (e) {
      log('Could not parse data as JSON');
    }
  }

  return (0, _omit2.default)(res, ['request', 'config']);
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _size = __webpack_require__(8);

var _size2 = _interopRequireDefault(_size);

var _map = __webpack_require__(9);

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MemoryStore = function () {
  function MemoryStore() {
    _classCallCheck(this, MemoryStore);

    this.store = {};
  }

  _createClass(MemoryStore, [{
    key: 'getItem',
    value: function getItem(key) {
      return Promise.resolve(this.store[key] || null);
    }
  }, {
    key: 'setItem',
    value: function setItem(key, value) {
      this.store[key] = value;
      return Promise.resolve(value);
    }
  }, {
    key: 'removeItem',
    value: function removeItem(key) {
      delete this.store[key];
      return Promise.resolve();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.store = {};
      return Promise.resolve();
    }
  }, {
    key: 'length',
    value: function length() {
      return Promise.resolve((0, _size2.default)(this.store));
    }
  }, {
    key: 'iterate',
    value: function iterate(fn) {
      return Promise.all((0, _map2.default)(this.store, function (value, key) {
        return fn(value, key);
      }));
    }
  }]);

  return MemoryStore;
}();

exports.default = MemoryStore;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exclude;
function exclude(req) {
  var exclusions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isString = __webpack_require__(12);

var _isString2 = _interopRequireDefault(_isString);

var _isFunction = __webpack_require__(0);

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createKey(config) {
  if ((0, _isFunction2.default)(config.key)) return config.key;

  var cacheKey = void 0;

  if ((0, _isString2.default)(config.key)) cacheKey = function cacheKey(req) {
    return config.key + '/' + req.url;
  };else cacheKey = function cacheKey(req) {
    return req.url;
  };

  return cacheKey;
}

exports.default = createKey;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function applyLimit(config) {
  return config.store.length().then(function (length) {
    config.debug("Current store size: " + length);

    if (length >= config.limit) {
      config.debug("Finding first cached item");

      var firstItem = void 0;

      return config.store.iterate(function (value, key) {
        if (!firstItem) firstItem = { value: value, key: key };
        if (value.expires < firstItem.value.expires) firstItem = { value: value, key: key };
      }).then(function () {
        if (firstItem) {
          config.debug("Found item: " + firstItem.key);

          return config.store.removeItem(firstItem.key);
        }
      });
    }
  });
}

exports.default = applyLimit;

/***/ })
/******/ ]);
});
//# sourceMappingURL=cache.js.map