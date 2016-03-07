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
function trim() {
  var s = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return ''.trim ? s.trim(s) : s.replace(/(^\s*|\s*$)/g, '');
}

// borrow from superagent
function parseHeaders() {
  var str = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var lines = str.split(/\r?\n/);
  var fields = {};
  var index = undefined;
  var line = undefined;
  var field = undefined;
  var val = undefined;

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
  var xhr = value.body || {};
  var headers = parseHeaders(value.headers);

  xhr.getAllResponseHeaders = function () {
    return value.headers;
  };

  xhr.getResponseHeader = function (header) {
    return headers[header];
  };

  return xhr;
}
module.exports = exports['default'];