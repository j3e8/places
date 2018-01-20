const url = require('url');
const https = require('https');
const app = require('express')();
const config = require('config');
const fs = require('fs');

const serverConfig = config.get("server");

app.get('/', function(req, res) {
  res.sendFile('src/index.html', { root: process.cwd() });
});

app.get('/bundle.js', function(req, res) {
  res.sendFile('www/bundle.js', { root: process.cwd() });
});

app.get('/bundle.css', function(req, res) {
  res.sendFile('www/bundle.css', { root: process.cwd() });
});

app.get('/assets/*', function(req, res) {
  res.sendFile('www' + req.url, { root: process.cwd() });
});

app.get('/components/*', function(req, res) {
  res.sendFile('src' + req.url, { root: process.cwd() });
});

app.get('/pages/*', function(req, res) {
  res.sendFile('src' + req.url, { root: process.cwd() });
});

app.get('/*', function(req, res) {
  res.sendFile('src/index.html', { root: process.cwd() });
});

let options = {
  cert: fs.readFileSync(config.get('https').cert),
  key: fs.readFileSync(config.get('https').key)
};
let server = https.createServer(options, app)
server.listen(serverConfig.port, () => {
  console.log(`Listening on ${url.format(serverConfig)}`);
});
