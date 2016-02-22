(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("superapi-cache", [], factory);
	else if(typeof exports === 'object')
		exports["superapi-cache"] = factory();
	else
		root["superapi-cache"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _readCache = __webpack_require__(1);
	
	var _readCache2 = _interopRequireDefault(_readCache);
	
	var _serialize = __webpack_require__(3);
	
	var _serialize2 = _interopRequireDefault(_serialize);
	
	var _memory = __webpack_require__(4);
	
	var _memory2 = _interopRequireDefault(_memory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function cache() {
	  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var store = config.store || _memory2.default;
	  var key = config.key || cache.key;
	
	  if (!store) {
	    throw new Error('Cache middleware need to be provided a store.');
	  }
	
	  config.maxAge = config.maxAge || 0;
	  config.readCache = config.readCache || _readCache2.default;
	  config.serialize = config.serialize || _serialize2.default;
	
	  config.exclude = config.exclude || [];
	
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
	
	    var found = false;
	
	    config.exclude.forEach(function (regexp) {
	      if (req.url.match(regexp)) {
	        found = true;
	        return false;
	      }
	    });
	
	    if (found) {
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
	        // clean up cache if stale
	        err.reason === 'cache-stale' ? store.removeItem(uuid).then(f) : f();
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
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
	
	      var expires = value.expires;
	      var data = value.data;
	
	      if (expires !== 0 && expires < Date.now()) {
	        log('cache-stale', req.url);
	        var error = new Error();
	
	        error.reason = 'cache-stale';
	        error.message = 'Value is stale';
	        return reject(error);
	      }
	
	      // hydrate pseudo xhr from cached value
	      req.xhr = (0, _hydrate2.default)(data);
	
	      // override request end callback
	      req.callback = function (err, res) {
	        log('cache-hit', req.url);
	
	        if (err) {
	          return reject(err, res);
	        }
	
	        resolve(res);
	      };
	
	      req.emit('end');
	    });
	  };
	};
	
	var _hydrate = __webpack_require__(2);

	var _hydrate2 = _interopRequireDefault(_hydrate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = hydrate;
	/**
	value should have the following format
	{
	  body: {
	    responseType: '',
	    responseText: value,
	    status: '',
	    statusText: ''
	  },
	  headers: ''
	}
	*/
	
	// borrow from superagent
	function trim(s) {
	  return ''.trim ? s.trim(s) : s.replace(/(^\s*|\s*$)/g, '');
	}
	
	// borrow from superagent
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; i += 1) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	function hydrate(value) {
	  var data = value.data;
	  var xhr = data.body || {};
	  var headers = parseHeader(data.headers || {});
	
	  xhr.getAllResponseHeaders = function () {
	    return data.headers;
	  };
	
	  xhr.getResponseHeader = function (header) {
	    return headers[header];
	  };
	
	  return xhr;
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = serialize;
	function serialize(req, res) {
	  return {
	    headers: res.xhr.getAllResponseHeaders(),
	    body: {
	      responseType: res.xhr.responseType,
	      responseText: res.xhr.responseText,
	      status: res.status,
	      statusText: res.statusText
	    }
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MemoryStore = function () {
	  function MemoryStore() {
	    _classCallCheck(this, MemoryStore);
	
	    this._store = {};
	  }
	
	  _createClass(MemoryStore, [{
	    key: "getItem",
	    value: function getItem(key) {
	      return Promise.resolve(this._store[key] || null);
	    }
	  }, {
	    key: "setItem",
	    value: function setItem(key, value) {
	      this._store[key] = value;
	      return Promise.resolve(value);
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      this._store = {};
	      return Promise.resolve();
	    }
	  }]);
	
	  return MemoryStore;
	}();
	
	exports.default = MemoryStore;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=superapi-cache.js.map