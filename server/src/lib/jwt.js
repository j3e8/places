let jwt = require('jsonwebtoken');

let publicKey, privateKey;
let options = {
  'algorithm': 'RS256',
  'duration': 15 * 60 * 1000
}

let JWT = {};

function init(pubkey, privkey, opt) {
  publicKey = pubkey;
  privateKey = privkey;
  if (opt && typeof(opt) == 'object') {
    options = Object.assign(options, opt);
  }

  JWT.sign = function(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, { 'algorithm': options.algorithm, 'expiresIn': options.duration }, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  }

  JWT.requirejwt = function(req, res, next) {
    let token = parseTokenFromHeader(req.headers.authorization);
    verify(token)
    .then((decoded) => {
      req.user = decoded.user;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(401).end();
    });
  }

  return JWT;
}

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { 'algorithms': [ options.algorithm ] }, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}

function parseTokenFromHeader(header) {
  if (header.substring(0, 7).toLowerCase() == 'bearer ') {
    return header.substring(7);
  }
  return header;
}

module.exports = {
  'init': init,
  'jwt': JWT
}
