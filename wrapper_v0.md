# Wrapper

```javascript
class Wrapper {
  constructor(definition) {
    this.def = definition;
    // pre process URIs and map to functions args only once
  }

  buildUrl(name, cb) { // promise as well?
    if (...) {
      return null;
    }
    const finalUrl = ...;
    if (cb === null) {
      throw('No callback specified');
    }
    cb(finalUrl);
  }

  call(name, params = {}) {
    ...
    return new Promise((resolve, reject) => {
      try {
        if (this.def[name].func === null) {
          throw `No such handler: ${name}`
        }
        this.buildUrl(name, (url) => {
          res = this.def[name]
          .func(url, params)
          .then((res) => {
            resolve(res)
          })
          .catch((e) => {
            reject(e);
          });
        })
      } catch(e) {
        // handle network error
        reject(e);
      }
    });
  }

  use(middleware) {} // might be useful
}
```

## Define

```javascript
//user.js
// function getUser(url, id) {
//   fetch(`/users/${id}`).then((response) => {
//     if (!response.ok) {
//       // handle response inconsistency
//       ...
//       throw 'Not found';
//     }
//     // do something with response
//     console.log(id);
//   })
// }

function getUser(url, id) {
  return new Promise((resolve, reject) => {
    fetch(url).then((response) => {
      if (!response.ok) {
        // handle response inconsistency
        ...
        reject('Not found or whatever');
      }
      // do something with response
      console.log(id);
      response.json();
    })
    .then((data) => {
      // do something with data
      resolve(data);
    })
  });

}

function postUser() {...}

export {
  getUser,
  postUser,
}
```

```javascript
import { getUser, ... } from './user.js';

const def = {
  basePath: '...',
  prefix: '...', // maybe
  routes: [
    'getUser': { // call name
      uri: '/users/:id', // :id auto processed by 'call' and it's parameters
      method: 'get',
      func: getUser, // only pure functions
    },
  ],
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
  // handle not found
  console.log(e);
});
```
