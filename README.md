# Coinglue-Connect

A simple middleware to communicate with coinglue via its JSON-RPC2

## Installation
- `npm install coinglue-connect`

## Usage

```js
CoinglueConn = require('coinglue-connect');
const r = new CoinglueConn({
  host: '127.0.0.1',
  port: 8179,
  username: 'coinglueuser',
  password: 'coingluepass',
  rpcVer: '2.0'
});

// via Promise
r.cmd('getinfo', 'eth').then(res => {
  console.log(res);
}).catch((err) => {
  console.error(err.stack || err.message);
});

// via Async/Await
(async () => {
  try {
    const res = await r.cmd('getaccount', 'btc', 1);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();


```