let jwt = require('jsonwebtoken');

let publicKey, privateKey;
let options = {
  'decodedObjectKey': 'jwt',
  'algorithm': 'RS256',
  'duration': '15m'
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

  JWT.verify = function(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }

  JWT.requirejwt = function(req, res, next) {
    let token = parseTokenFromHeader(headers.authorization);
    JWT.verify(token)
    .then((decoded) => {
      req[options.decodedObjectKey] = decoded;
      next();
    })
    .catch((err) => {
      res.status(401).end();
    });
  }

  return JWT;
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
