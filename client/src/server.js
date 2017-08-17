let url = require('url');
let app = require('express')();
let config = require('config');

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

app.listen(serverConfig.port, () => {
  console.log(`Listening on ${url.format(serverConfig)}`);
});
