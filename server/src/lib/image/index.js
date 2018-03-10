const config = require('config');
const PATH_TO_PROFILES = config.has('aws') ? `${config.get('aws').s3.host}/${config.get('aws').s3.bucket}/profiles` : '';

module.exports = {
  PATH_TO_PROFILES: PATH_TO_PROFILES,
  getExtensionOfBase64: require('./get-extension-of-base64'),
  getContentTypeOfFile: require('./get-content-type-of-file'),
  getExtensionOfFilename: require('./get-extension-of-filename'),
  uploadToS3: require('./upload-to-s3')
}
