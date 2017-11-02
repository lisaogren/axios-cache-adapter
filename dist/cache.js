(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/omit"), require("lodash/isFunction"), require("axios"), require("lodash/merge"), require("lodash/isString"), require("lodash/size"), require("lodash/map"), require("lodash/extend"), require("lodash/find"), require("lodash/isEmpty"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/omit", "lodash/isFunction", "axios", "lodash/merge", "lodash/isString", "lodash/size", "lodash/map", "lodash/extend", "lodash/find", "lodash/isEmpty"], factory);
	else if(typeof exports === 'object')
		exports["axiosCacheAdapter"] = factory(require("lodash/omit"), require("lodash/isFunction"), require("axios"), require("lodash/merge"), require("lodash/isString"), require("lodash/size"), require("lodash/map"), require("lodash/extend"), require("lodash/find"), require("lodash/isEmpty"));
	else
		root["axiosCacheAdapter"] = factory(root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_17__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.key = exports.write = exports.read = undefined;

var write = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config, req, res) {
    var entry;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            entry = {
              expires: config.expires,
              data: (0, _serialize2.default)(config, req, res)
            };
            _context.next = 4;
            return config.store.setItem(config.uuid, entry);

          case 4:
            _context.next = 19;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);

            config.debug('Could not store response', _context.t0);

            if (!config.clearOnError) {
              _context.next = 18;
              break;
            }

            _context.prev = 10;
            _context.next = 13;
            return config.store.clear();

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t1 = _context['catch'](10);

            config.debug('Could not clear store', _context.t1);

          case 18:
            return _context.abrupt('return', false);

          case 19:
            return _context.abrupt('return', true);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6], [10, 15]]);
  }));

  return function write(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var read = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(config, req) {
    var uuid, entry, error, expires, data, _error;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            uuid = config.uuid;
            _context2.next = 3;
            return config.store.getItem(uuid);

          case 3:
            entry = _context2.sent;

            if (!(!entry || !entry.data)) {
              _context2.next = 10;
              break;
            }

            config.debug('cache-miss', req.url);
            error = new Error();


            error.reason = 'cache-miss';
            error.message = 'Entry not found from cache';

            throw error;

          case 10:
            expires = entry.expires, data = entry.data;

            if (!(expires !== 0 && expires < Date.now())) {
              _context2.next = 17;
              break;
            }

            config.debug('cache-stale', req.url);
            _error = new Error();


            _error.reason = 'cache-stale';
            _error.message = 'Entry is stale';

            throw _error;

          case 17:

            config.debug('cache-hit', req.url);

            return _context2.abrupt('return', data);

          case 19:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function read(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var _isString = __webpack_require__(6);

var _isString2 = _interopRequireDefault(_isString);

var _isFunction = __webpack_require__(2);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _serialize = __webpack_require__(7);

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function key(config) {
  if ((0, _isFunction2.default)(config.key)) return config.key;

  var cacheKey = void 0;

  if ((0, _isString2.default)(config.key)) cacheKey = function cacheKey(req) {
    return config.key + '/' + req.url;
  };else cacheKey = function cacheKey(req) {
    return req.url;
  };

  return cacheKey;
}

exports.read = read;
exports.write = write;
exports.key = key;
exports.default = { read: read, write: write, key: key };

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCache = exports.setup = undefined;

var _axios = __webpack_require__(4);

var _axios2 = _interopRequireDefault(_axios);

var _omit = __webpack_require__(1);

var _omit2 = _interopRequireDefault(_omit);

var _merge = __webpack_require__(5);

var _merge2 = _interopRequireDefault(_merge);

var _isFunction = __webpack_require__(2);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _cache = __webpack_require__(0);

var _memory = __webpack_require__(8);

var _memory2 = _interopRequireDefault(_memory);

var _request = __webpack_require__(11);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// ---------------------
// Cache Adapter
// ---------------------

var defaults = {
  cache: {
    maxAge: 0,
    limit: false,
    store: null,
    key: null,
    exclude: {
      paths: [],
      query: true,
      filter: null
    },
    adapter: _axios2.default.defaults.adapter,
    clearOnStale: true,
    clearOnError: true,
    debug: false
  },
  axios: {
    cache: {
      maxAge: 15 * 60 * 1000
    }
  }

  /**
   * Configure cache adapter
   *
   * @param   {object} [config={}] Cache adapter options
   * @returns {object} Object containing cache `adapter` and `store`
   */
};function setupCache() {

  // Axios adapter. Receives the axios request configuration as only parameter
  var adapter = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
      var res, next;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _request2.default)(config, req);

            case 2:
              res = _context.sent;
              next = res.next;

              // Response is not function, something was in cache, return it

              if ((0, _isFunction2.default)(next)) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return', next);

            case 6:
              _context.next = 8;
              return config.adapter(req);

            case 8:
              res = _context.sent;
              return _context.abrupt('return', next(res));

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function adapter(_x2) {
      return _ref.apply(this, arguments);
    };
  }();

  // Return adapter and store instance


  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Extend default configuration
  config = (0, _merge2.default)({}, defaults.cache, config);

  // Create a cache key method
  config.key = (0, _cache.key)(config);

  // If debug mode is on, create a simple logger method
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

  // Create an in memory store if none was given
  if (!config.store) config.store = new _memory2.default();return {
    adapter: adapter,
    store: config.store
  };
}

// ---------------------
// Easy API Setup
// ---------------------

/**
 * Setup an axios instance with the cache adapter pre-configured
 *
 * @param {object} [options={}] Axios and cache adapter options
 * @returns {object} Instance of Axios
 */
function setup() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  config = (0, _merge2.default)({}, defaults.axios, config);

  var cache = setupCache(config.cache);
  var axiosConfig = (0, _omit2.default)(config, ['cache']);

  var api = _axios2.default.create((0, _merge2.default)({}, axiosConfig, { adapter: cache.adapter }));

  api.cache = cache.store;

  return api;
}

exports.setup = setup;
exports.setupCache = setupCache;
exports.default = { setup: setup, setupCache: setupCache };

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit = __webpack_require__(1);

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serialize(config, req, res) {
  if (res.data) {
    // FIXME: May be useless as localForage and axios already parse automatically
    try {
      res.data = JSON.parse(res.data);
    } catch (err) {
      config.debug('Could not parse data as JSON', err);
    }
  }

  return (0, _omit2.default)(res, ['request', 'config']);
}

exports.default = serialize;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _size = __webpack_require__(9);

var _size2 = _interopRequireDefault(_size);

var _map = __webpack_require__(10);

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MemoryStore = function () {
  function MemoryStore() {
    _classCallCheck(this, MemoryStore);

    this.store = {};
  }

  _createClass(MemoryStore, [{
    key: 'getItem',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.store[key] || null);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getItem(_x) {
        return _ref.apply(this, arguments);
      }

      return getItem;
    }()
  }, {
    key: 'setItem',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(key, value) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.store[key] = value;

                return _context2.abrupt('return', value);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setItem(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return setItem;
    }()
  }, {
    key: 'removeItem',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                delete this.store[key];

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function removeItem(_x4) {
        return _ref3.apply(this, arguments);
      }

      return removeItem;
    }()
  }, {
    key: 'clear',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.store = {};

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function clear() {
        return _ref4.apply(this, arguments);
      }

      return clear;
    }()
  }, {
    key: 'length',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt('return', (0, _size2.default)(this.store));

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function length() {
        return _ref5.apply(this, arguments);
      }

      return length;
    }()
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
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var request = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config, req) {
    var uuid, next, method, res, excludeFromCache;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            excludeFromCache = function excludeFromCache() {
              config.excludeFromCache = true;

              return { config: config, next: next };
            };

            uuid = config.key(req);

            config = (0, _extend2.default)({}, config, { uuid: uuid });

            next = function next() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return _response2.default.apply(undefined, [config, req].concat(args));
            };

            if (!(0, _exclude2.default)(config, req)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', excludeFromCache());

          case 6:

            // clear cache if method different from GET.
            // We should exclude HEAD
            method = req.method.toLowerCase();

            if (!(method === 'head')) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', excludeFromCache());

          case 9:
            if (!(method !== 'get')) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return config.store.removeItem(uuid);

          case 12:
            return _context.abrupt('return', excludeFromCache());

          case 13:
            _context.prev = 13;
            _context.next = 16;
            return (0, _cache.read)(config, req);

          case 16:
            res = _context.sent;


            res.config = req;
            res.request = { fromCache: true };

            return _context.abrupt('return', { config: config, next: res });

          case 22:
            _context.prev = 22;
            _context.t0 = _context['catch'](13);

            if (!(config.clearOnStale && _context.t0.reason === 'cache-stale')) {
              _context.next = 27;
              break;
            }

            _context.next = 27;
            return config.store.removeItem(uuid);

          case 27:
            return _context.abrupt('return', { config: config, next: next });

          case 28:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[13, 22]]);
  }));

  return function request(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _extend = __webpack_require__(12);

var _extend2 = _interopRequireDefault(_extend);

var _response = __webpack_require__(13);

var _response2 = _interopRequireDefault(_response);

var _exclude = __webpack_require__(15);

var _exclude2 = _interopRequireDefault(_exclude);

var _cache = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = request;

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

var response = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config, req, res) {
    var type;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = res.status / 100 | 0;

            // only cache 2xx response

            if (!(type !== 2)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', res);

          case 3:
            if (!(['arraybuffer', 'blob'].indexOf(res.responseType) > -1)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', res);

          case 5:
            if (config.excludeFromCache) {
              _context.next = 13;
              break;
            }

            config.expires = config.maxAge === 0 ? 0 : Date.now() + config.maxAge;

            if (!config.limit) {
              _context.next = 11;
              break;
            }

            config.debug('Detected limit: ' + config.limit);

            _context.next = 11;
            return (0, _limit2.default)(config);

          case 11:
            _context.next = 13;
            return (0, _cache.write)(config, req, res);

          case 13:
            return _context.abrupt('return', res);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function response(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _limit = __webpack_require__(14);

var _limit2 = _interopRequireDefault(_limit);

var _cache = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = response;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var limit = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
    var length, firstItem;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return config.store.length();

          case 2:
            length = _context.sent;

            if (!(length < config.limit)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:

            config.debug("Current store size: " + length);

            firstItem = void 0;
            _context.next = 9;
            return config.store.iterate(function (value, key) {
              if (!firstItem) firstItem = { value: value, key: key };
              if (value.expires < firstItem.value.expires) firstItem = { value: value, key: key };
            });

          case 9:
            if (!firstItem) {
              _context.next = 13;
              break;
            }

            config.debug("Removing item: " + firstItem.key);

            _context.next = 13;
            return config.store.removeItem(firstItem.key);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function limit(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = limit;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _find = __webpack_require__(16);

var _find2 = _interopRequireDefault(_find);

var _isEmpty = __webpack_require__(17);

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exclude() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var req = arguments[1];
  var _config$exclude = config.exclude,
      exclude = _config$exclude === undefined ? {} : _config$exclude,
      debug = config.debug;


  if (typeof exclude.filter === 'function' && exclude.filter(req)) {
    debug('Excluding request by filter ' + req.url);

    return true;
  }

  // do not cache request with query
  var hasQueryParams = req.url.match(/\?.*$/) || !(0, _isEmpty2.default)(req.params);

  if (exclude.query && hasQueryParams) {
    debug('Excluding request by query ' + req.url);

    return true;
  }

  var paths = exclude.paths || [];
  var found = (0, _find2.default)(paths, function (regexp) {
    return req.url.match(regexp);
  });

  if (found) {
    debug('Excluding request by url match ' + req.url);

    return true;
  }

  return false;
}

exports.default = exclude;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_16__;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_17__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=cache.js.map