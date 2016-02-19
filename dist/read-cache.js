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

var _hydrate = require('./hydrate');

var _hydrate2 = _interopRequireDefault(_hydrate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];