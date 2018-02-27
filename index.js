const crypto = require('crypto');
const needle = require('needle');
module.exports = class CoinglueConn {
  constructor (opts) {
    this.opts = {
      host: opts.host || 'localhost',
      port: opts.port || 8179,
      username: opts.username,
      password: opts.password,
      rpcVer: '2.0'
    };
    if (this.opts.username && this.opts.password) {
      this.token = crypto.createHmac('sha256', this.opts.password).update(this.opts.username).digest('hex');
    }
  }
  _parser (arg) {
    if (arg.legth == 0) {
      throw new Error('Invalid parameter size');
    }
    const method = arg[0];
    const params = arg.slice(1, arg.length);
    return { method, params };
  }

  async cmd (...args) {
    const { method, params } = this._parser(args);
    const reqopts = {};
    const payload = {
      method,
      params,
      id: 'coinglue-connect',
      jsonrpc: this.opts.rpcVer
    };
    if (this.token) {
      reqopts.headers = { 'Authorization': `Token ${this.token}` };
    }
    const { body } = await needle('post', `${this.opts.host}:${this.opts.port}`, JSON.stringify(payload), reqopts);
    if (body.jsonrpc !== '2.0' || body.id !== 'coinglue-connect') {
      throw new Error('Invalid response');
    }
    if (body.error) {
      return body.error.message;
    } else {
      return body.result;
    }
  }
};
