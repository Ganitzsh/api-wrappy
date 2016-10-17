'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (process.env.NODE_ENV === 'test') {
  console.log('test');
  var fetch = require('node-fetch');
}

var Wrappy = function () {
  function Wrappy(definition) {
    _classCallCheck(this, Wrappy);

    this.def = definition;
  }

  _createClass(Wrappy, [{
    key: 'buildUrl',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, params) {
        var uri, splitted, finalUrl;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                uri = this.def.routes[name].uri;
                splitted = uri.substr(1).split('/');
                finalUrl = this.def.basePath + (this.def.prefix ? this.def.prefix : '');


                splitted.forEach(function (part) {
                  var toAdd = part;
                  if (part.startsWith(':')) {
                    var clean = part.substr(1);
                    if (!params[clean]) {
                      throw new Error('Missing parameter: ' + clean);
                    }
                    toAdd = params[clean];
                  }
                  if (toAdd !== '') {
                    finalUrl += '/' + toAdd;
                  }
                });
                console.log('call to:', finalUrl);
                return _context.abrupt('return', finalUrl);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function buildUrl(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return buildUrl;
    }()
  }, {
    key: 'createRequest',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name, params) {
        var init;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                init = {
                  method: this.def.routes[name].method,
                  mode: 'cors',
                  headers: _extends({}, params.headers)
                };

                if (this.def.routes[name].contentType) {
                  init.headers['Content-Type'] = this.def.routes[name].contentType;
                }
                if (params && params.body && this.def.routes[name].method !== 'get') {
                  init.body = params.body;
                }
                console.log(init);
                // return new Request(url, init);
                return _context2.abrupt('return', init);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createRequest(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return createRequest;
    }()
  }, {
    key: 'callMultiple',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(pArray) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', Promise.all(pArray));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function callMultiple(_x5) {
        return _ref3.apply(this, arguments);
      }

      return callMultiple;
    }()
  }, {
    key: 'call',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(name) {
        var _this = this;

        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { body: {}, headers: {} };
        var url, req;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.def.routes[name]) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('No such handler: ' + name);

              case 2:
                _context4.next = 4;
                return this.buildUrl(name, params);

              case 4:
                url = _context4.sent;
                _context4.next = 7;
                return this.createRequest(name, params);

              case 7:
                req = _context4.sent;

                console.log(url);
                return _context4.abrupt('return', fetch(url, req).then(function (response) {
                  if (!response.ok) {
                    console.log(response);
                    throw new Error('Request error: status is '); // TODO: add status
                  }
                  switch (_this.def.responseType) {
                    case 'blob':
                      return response.blob();
                    default:
                      return response.json();
                  }
                }));

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function call(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return call;
    }()
  }]);

  return Wrappy;
}();

exports.default = Wrappy;