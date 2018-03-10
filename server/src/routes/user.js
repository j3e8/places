const jwt = require('../lib/jwt').jwt;
const ErrorHandler = require('../lib/error-handler');
const User = require('../api/user');

module.exports = function(app) {
  app.post('/api/user/authenticate', function(req, res) {
    User.authenticate(req.headers, req.body)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.post('/api/user', function(req, res) {
    User.createUser(req.body)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/user/:userId', function(req, res) {
    User.updateUser(req.params.userId, req.body)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/users', jwt.optionaljwt, function(req, res) {
    User.searchUsers(req.user, req.query)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.post('/api/user/:userId/follows/:followsUserId', jwt.requirejwt, function(req, res) {
    User.follow(req.params.userId, req.params.followsUserId, req.user)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.delete('/api/user/:userId/follows/:followsUserId', jwt.requirejwt, function(req, res) {
    User.unfollow(req.params.userId, req.params.followsUserId, req.user)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId', jwt.optionaljwt, function(req, res) {
    User.getUser(req.params.userId, req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
