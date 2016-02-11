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