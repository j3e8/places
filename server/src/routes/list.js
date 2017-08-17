let List = require('../api/list');

module.exports = function(app) {
  app.post('/api/list', function(req, res) {
    List.create(req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/list/:listId', function(req, res) {
    List.update(req.params.listId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/list/:listId', function(req, res) {
    List.get(req.params.listId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
