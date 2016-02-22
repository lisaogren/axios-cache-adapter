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
  var xhr = value.body || {};
  var headers = parseHeader(value.headers || {});

  xhr.getAllResponseHeaders = function () {
    return value.headers;
  };

  xhr.getResponseHeader = function (header) {
    return headers[header];
  };

  return xhr;
}
module.exports = exports['default'];