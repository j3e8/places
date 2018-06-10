const ImageUtil = require('../../../lib/image');

module.exports = function updatePlaceImage(userId, placeId, img_file, img_file_thumb) {
  const filename = `${userId}_${placeId}`;
  const thumbFilename = `${userId}_${placeId}_thumb`;

  return Promise.all([
    uploadImage(filename, img_file),
    uploadImage(thumbFilename, img_file_thumb)
  ])
  .then((results) => {
    return Promise.resolve({
      placeImgUrl: results[0],
      placeThumbUrl: results[1]
    })
  })
}

function uploadImage(basicFilename, img_file) {
  if (!img_file) {
    return Promise.resolve();
  }

  // upload to s3
  const extension = ImageUtil.getExtensionOfBase64(img_file);
  const filename = `${basicFilename}.${extension}`;
  const base64prefix = img_file.substring(0, img_file.indexOf('base64,') + 7);
  const base64 = img_file.substring(base64prefix.length);
  const buf = new Buffer(base64, 'base64');

  console.log('uploadToS3');
  return ImageUtil.uploadToS3(`places/${filename}`, buf)
  .then(() => ImageUtil.PATH_TO_PLACES + `/${filename}`);
}
