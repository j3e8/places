let jwt = require('../modules/jwt').jwt;
let ErrorHandler = require('../modules/error-handler');
let User = require('../api/user');

module.exports = function(app) {
  app.post('/api/user/authenticate', function(req, res) {
    User.authenticate(req.body)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.post('/api/user', function(req, res) {
    User.create(req.body)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId', jwt.requirejwt, function(req, res) {
    User.get(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
