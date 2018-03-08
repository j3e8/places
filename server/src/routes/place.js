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

  app.get(['/api/places', '/api/place'], jwt.optionaljwt, function(req, res) {
    Place.searchPlaces(req.user, req.query)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/place/:placeId', jwt.requirejwt, function(req, res) {
    Place.updatePlace(req.user, req.params.placeId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.put('/api/user/:userId/place/:placeId', jwt.requirejwt, function(req, res) {
    Place.updateUserPlace(req.user, req.params.userId, req.params.placeId, req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/place/:placeId', function(req, res) {
    Place.getPlace(req.params.placeId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/places/popular', function(req, res) {
    Place.getPopularPlaces()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId/places', function(req, res) {
    Place.getRecentPlacesForUser(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/user/:userId/follows/places', function(req, res) {
    Place.getRecentPlacesForUsersNetwork(req.params.userId)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/placetypes', function(req, res) {
    PlaceType.listAll()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
