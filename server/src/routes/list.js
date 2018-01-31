const jwt = require('../lib/jwt').jwt;
const List = require('../api/list');
const ErrorHandler = require('../lib/error-handler');

module.exports = function(app) {
  app.post('/api/list', jwt.requirejwt, function(req, res) {
    List.createList(req.user, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/list/:listId', jwt.requirejwt, function(req, res) {
    List.updateList(req.user, req.params.listId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/list/:listId', jwt.optionaljwt, function(req, res) {
    List.getList(req.params.listId, req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId/lists', function(req, res) {
    List.getListsCreatedByUser(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
