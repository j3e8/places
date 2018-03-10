const getExtensionOfFilename = require('./get-extension-of-filename');

module.exports = function(path) {
  const extension = getExtensionOfFilename(path);
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'binary/octet-stream';
  }
}
