# Wrapper

```javascript
class Wrapper {
  constructor(definition) {
    this.def = definition;
    // pre process URIs
  }

  // compile the full url
  buildUrl(name, cb) { // promise as well?
    if (...) {
      return null;
    }
    let finalUrl = ...;
    finalUrl += ...;
    if (cb === null) {
      throw('No callback specified');
    }
    cb(finalUrl);
  }

  // @params: contains body if needed
  call(name, params = { body: {} }) {
    ...
    let init = {
      method: this.def[name].method,
      mode: 'cors', // easily removable
      body: (params.body) ? params.body : null,
      ...
    };
    if (this.def.name.contentType) { // if content-type specified
      init.headers = {
        'Content-Type': this.def.name.contentType
      }
      // check middleware list...
      ...
    }
    return new Promise((resolve, reject) => {
      this.buildUrl(name, (url) => {
        var myRequest = new Request(url, init);
        fetch(url).then((response) => {
          switch (this.def.responseType) {
            case 'blob':
              return response.blob();
              break;
            default:
             return response.json(); // default is JSON - duh!
          }
        }).catch((e) => {
          reject(e);
        });
      })
    });
  }

  use(middleware) {} // might be useful
}
```

## Define

```javascript
// contentType is for the Request header's 'Content-Type'
// responseType is for the Response header's 'Content-Type'
// cf: https://developer.mozilla.org/en-US/docs/Web/API/Response#Methods
// works for fetch or any other http client
const def = {
  basePath: '...',
  prefix: '...', // maybe
  routes: {
    'getUser': { // call name
      uri: '/user/:id', // :id auto processed by 'call' and it's parameters
      method: 'get',
      responseType: 'json',
    },
    'createUser': {
      uri: '/user',
      method: 'post',
      contentType: 'application/xml', // I know xml sucks, it's just an example
      responseType: 'json',
    },
    ...
  },
};
```

## Instantiate

```javascript
// app.config.js
import Wrapper from 'wrapper'; // wrapper inside node_modules

import def from './def.js';

const wrapper = new Wrapper(def);
// OR directly define, whatever
const wrapper = new Wrapper({...});

export default wrapper;
```

## Use

```javascript
// compponent.js
import wrapper from './app.config.js';

try {
  wrapper.call('getUser', {id: 24}).then((userList) => {
    ...
  });
} catch (e) {
  // handle error
  console.log(e);
}
// OR
wrapper.call('getUser', {id: 24})
.then((userList) => {...})
.catch((e) => {
  // handle not found or whatever
  console.log(e);
});
```
