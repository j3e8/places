const db = require('../connections/db');
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
      if (req.headers['kulana-user-id']) {
        return getUserFromHeader(req.headers['kulana-user-id'])
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => next());
      }
      next();
    });
  }

  JWT.decode = function(authHeader) {
    let token = parseTokenFromHeader(authHeader);
    if (!token) {
      return Promise.reject("No auth token provided");
    }
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
  if (!header) {
    return null;
  }
  if (header.substring(0, 7).toLowerCase() == 'bearer ') {
    return header.substring(7);
  }
  return header;
}

function getUserFromHeader(userId) {
  let _id = db.escape(userId);
  return db.query(`SELECT u.id, u.username, u.email, u.dateCreated, u.userType, u.imgUrl
    FROM users AS u
    WHERE id=${_id}
  `)
  .then((rows) => {
    if (rows.length) {
      let user = rows[0];
      return Promise.resolve(user);
    }
  });
}

module.exports = {
  'init': init,
  'jwt': JWT
}
