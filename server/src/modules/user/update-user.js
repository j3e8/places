const db = require('../../connections/db');
const encryptPassword = require('../../lib/encrypt-password');
const getUser = require('./get-user');
const ImageUtil = require('../../lib/image');

module.exports = function(userId, requestBody) {
  return updateUserImage(userId, requestBody.img_file)
  .then((imgUrl) => {
    let _userId = db.escape(userId);
    let user = {
      'username': requestBody.username || undefined,
      'imgUrl': imgUrl || undefined,
      'bio': requestBody.bio || undefined,
      'email': requestBody.email || undefined,
      'password': requestBody.password ? encryptPassword(requestBody.password) : undefined
    }
    stripUndefinedProperties(user);
    return db.query(`UPDATE users SET ? WHERE id=${_userId}`, user);
  })
  .then((result) => getUser(userId));
}

function updateUserImage(userId, img_file) {
  if (!img_file) {
    return Promise.resolve();
  }
  // upload to s3
  const extension = ImageUtil.getExtensionOfBase64(img_file);
  const filename = `${userId}.${extension}`;
  const base64prefix = img_file.substring(0, img_file.indexOf('base64,') + 7);
  const base64 = img_file.substring(base64prefix.length);
  const buf = new Buffer(base64, 'base64');
  return ImageUtil.uploadToS3(`profiles/${filename}`, buf)
  .then(() => ImageUtil.PATH_TO_PROFILES + `/${filename}`);
}

function stripUndefinedProperties(user) {
  for (let prop in user) {
    if (user[prop] === undefined) {
      delete user[prop];
    }
  }
}
