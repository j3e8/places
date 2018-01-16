const jwt = require('../lib/jwt').jwt;
const Place = require('../api/place');
const PlaceType = require('../api/placetype');
const ErrorHandler = require('../lib/error-handler');

module.exports = function(app) {
  app.post('/api/place', jwt.requirejwt, function(req, res) {
    Place.createPlace(req.user, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/place/:placeId', jwt.requirejwt, function(req, res) {
    Place.updatePlace(req.params.placeId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/place/:placeId', function(req, res) {
    Place.getPlace(req.params.placeId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/placetypes', function(req, res) {
    PlaceType.listAll()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
