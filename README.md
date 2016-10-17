# Uniwrap

## Install

```
npm install --save wrappy
```

## Define

```javascript
// contentType is for the Request header's 'Content-Type'
// responseType is for the Response header's 'Content-Type'
// cf: https://developer.mozilla.org/en-US/docs/Web/API/Response#Methods
// works for fetch or any other http client
const def = {
  basePath: 'http://api.example.com',
  prefix: '/v0', // not required
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
import Wrappy from 'wrapper'; // wrapper inside node_modules

import def from './def.js';

const wrapper = new Wrappy(def);
// OR directly define, whatever
const wrapper = new Wrappy({...});

export default wrapper;
```

## Use

```javascript
import wrapper from './app.config.js';

async function apiCalls() {
  try {
    wrapper.call('getUser', {id: 24}).then((user) => {
      ...
    });
  } catch (err) {
    // handle error
    console.log('Error: ', err);
  }
  // OR
  wrapper.call('getUser', {id: 24}) // still works as async returns a promise
  .then((user) => {...})
  .catch((e) => {
    // handle not found or whatever
    console.log('Error: ', err);
  });
  // OR
  try {
    const user = await wrapper.call('getUser', {id: 24});
    const userList = await wrapper.call('createUser', {
      headers: {Authorization: 'Bearer <ANiceToken>'},
      body: {name: 'Foo'},
    });
    //OR
    const ret = wrapper.callMultiple([
      wrapper.call('getUser', {id: 24}),
      wrapper.call('createUser', {...}),
      ...
    ]); // ret = [response for getUser, response for createUser, ...]; <- Very powerful
  } catch(err) {
    console.log('Error: ', err); // Errors are caught, allelujah!
  }
}
```
