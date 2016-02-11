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