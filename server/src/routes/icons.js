const Icon = require('../api/icon');
const ErrorHandler = require('../lib/error-handler');

module.exports = function(app) {
  app.get('/api/icons', function(req, res) {
    Icon.listIcons()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });

  app.get('/api/icon/default', function(req, res) {
    Icon.getDefaultIcon()
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
