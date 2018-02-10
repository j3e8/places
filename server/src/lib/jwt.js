let jwt = require('jsonwebtoken');

let publicKey, privateKey;
let options = {
  'algorithm': 'RS256',
  'duration': 24 * 60 * 60 * 1000
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
    JWT.decode(req.headers.authorization)
    .then((decoded) => {
      req.user = decoded.user;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(401).end();
    });
  }

  JWT.optionaljwt = function(req, res, next) {
    JWT.decode(req.headers.authorization)
    .then((decoded) => {
      req.user = decoded.user;
      next();
    })
    .catch((err) => {
      next();
    });
  }

  JWT.decode = function(authHeader) {
    let token = parseTokenFromHeader(authHeader);
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, { 'algorithms': [ options.algorithm ] }, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
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
