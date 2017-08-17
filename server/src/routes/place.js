let Place = require('../api/place');
let PlaceType = require('../api/placetype');

module.exports = function(app) {
  app.post('/api/place', function(req, res) {
    Place.create(req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/place/:placeId', function(req, res) {
    Place.update(req.params.placeId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/place/:placeId', function(req, res) {
    Place.get(req.params.placeId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/placetypes', function(req, res) {
    PlaceType.listAll()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
