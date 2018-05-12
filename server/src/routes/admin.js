const jwt = require('../lib/jwt').jwt;
const Admin = require('../api/admin');
const ErrorHandler = require('../lib/error-handler');

module.exports = function(app) {
  app.get('/api/admin/count', jwt.requirejwt, function(req, res) {
    Admin.getDashboardCounts(req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/admin/users/recent', jwt.requirejwt, function(req, res) {
    Admin.getRecentUsers(req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/admin/lists/recent', jwt.requirejwt, function(req, res) {
    Admin.getRecentLists(req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/admin/places/recent', jwt.requirejwt, function(req, res) {
    Admin.getRecentPlaces(req.user)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

}
