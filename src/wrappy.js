import 'babel-polyfill';

class Wrappy {
  constructor(definition) {
    this.def = (definition) ? definition : instance.def;
  }

  async buildUrl(name, params) {
    const uri = this.def.routes[name].uri;
    const splitted = uri.substr(1).split('/');
    let finalUrl = this.def.basePath + ((this.def.prefix) ? this.def.prefix : '');

    splitted.forEach((part) => {
      let toAdd = part;
      if (part.startsWith(':')) {
        const clean = part.substr(1);
        if (!params[clean]) {
          throw new Error(`Missing parameter: ${clean}`);
        }
        toAdd = params[clean];
      }
      if (toAdd !== '') {
        finalUrl += `/${toAdd}`;
      }
    });
    console.log('call to:', finalUrl);
    return finalUrl;
  }

  async createRequest(url, name, params) {
    const init = {
      method: this.def.routes[name].method,
      mode: 'cors',
      headers: { ...params.headers },
    };
    if (this.def.routes[name].contentType) {
      init.headers = {
        'Content-Type': this.def.routes[name].contentType,
      };
    }
    if (params && params.body && this.def.routes[name].method !== 'get') {
      init.body = params.body;
    }
    return new Request(url, init);
  }

  async callMultiple(pArray) {
    return Promise.all(pArray);
  }

  async call(name, params = { body: {}, headers: {} }) {
    if (!this.def.routes[name]) {
      throw new Error(`No such handler: ${name}`);
    }
    const url = await this.buildUrl(name, params);
    const req = await this.createRequest(url, name, params);
    return fetch(req).then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error('Request error: status is '); // TODO: add status
      }
      switch (this.def.responseType) {
        case 'blob':
          return response.blob();
        default:
          return response.json();
      }
    });
  }
}

export default Wrappy;
