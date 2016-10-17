'use strict';

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def = {
  basePath: 'http://loalhost',
  prefix: 'v0',
  routes: {
    getUser: {
      uri: '/user/:id',
      method: 'get',
      responseType: 'json'
    }
  }
};

var wrapper = new _2.default(def);

wrapper.call('getUser', { id: 3 }).then(function (data) {
  console.log(data);
}).catch(function (error) {
  console.log(error);
});