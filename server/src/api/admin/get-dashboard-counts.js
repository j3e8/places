const UserModule = require('../../modules/user');
const ListModule = require('../../modules/list');
const PlaceModule = require('../../modules/place');

module.exports = function(user) {
  if (user.userType != 'admin') {
    return Promise.reject({ code: 401, message: "Unauthorized, you fool" });
  }

  let result = {};
  return UserModule.countUsers()
  .then((u) => {
    result.users = u;
    return ListModule.countLists();
  })
  .then((l) => {
    result.lists = l;
    return PlaceModule.countPlaces();
  })
  .then((p) => {
    result.places = p;
    return Promise.resolve(result);
  });
}
