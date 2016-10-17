import Wrappy from './';

var def = {
  basePath: 'http://loalhost',
  prefix: 'v0',
  routes: {
    getUser: {
      uri: '/user/:id',
      method: 'get',
      responseType: 'json',
    }
  }
}

const wrapper = new Wrappy(def);

wrapper
  .call('getUser', {id: 3})
  .then((data) => {console.log(data);})
  .catch((error) => {console.log(error)})
