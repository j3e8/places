const ImageUtil = require('../../../lib/image');

module.exports = function updatePlaceImage(userId, placeId, img_file) {
  if (!img_file) {
    return Promise.resolve();
  }

  // upload to s3
  const extension = ImageUtil.getExtensionOfBase64(img_file);
  const filename = `${userId}_${placeId}.${extension}`;
  const base64prefix = img_file.substring(0, img_file.indexOf('base64,') + 7);
  const base64 = img_file.substring(base64prefix.length);
  const buf = new Buffer(base64, 'base64');

  console.log('1');
  return ImageUtil.uploadToS3(`places/${filename}`, buf)
  .then(() => ImageUtil.PATH_TO_PLACES + `/${filename}`);
}
