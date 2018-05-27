const jwt = require('../lib/jwt').jwt;
const List = require('../api/list');
const ErrorHandler = require('../lib/error-handler');

module.exports = function(app) {
  app.post('/api/list', jwt.requirejwt, function(req, res) {
    List.createList(req.user, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/lists', jwt.optionaljwt, function(req, res) {
    List.searchLists(req.user, req.query)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/list/:listId', jwt.requirejwt, function(req, res) {
    List.updateList(req.user, req.params.listId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/list/:listId/viewed', jwt.optionaljwt, function(req, res) {
    List.markListAsRecentlyViewed(req.user, req.params.listId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/list/:listId', jwt.optionaljwt, function(req, res) {
    List.getList(req.params.listId, req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/list/:listId/user/:userId', jwt.optionaljwt, function(req, res) {
    List.getListForUser(req.params.listId, req.params.userId, req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.post('/api/user/:userId/list/:listId', jwt.requirejwt, function(req, res) {
    List.followList(req.user, req.params.userId, req.params.listId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.delete('/api/user/:userId/list/:listId', jwt.requirejwt, function(req, res) {
    List.unfollowList(req.user, req.params.userId, req.params.listId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId/lists/created', function(req, res) {
    List.getListsCreatedByUser(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId/lists/followed', function(req, res) {
    List.getListsFollowedByUser(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId/follows/lists', function(req, res) {
    List.getRecentListsForUsersNetwork(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/lists/popular', jwt.optionaljwt, function(req, res) {
    List.getPopularLists(req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/lists', jwt.optionaljwt, function(req, res) {
    List.searchLists(req.user, req.query)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
