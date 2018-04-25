const config = require('config');
const getContentTypeOfFile = require('./get-content-type-of-file');

const AWS = require('aws-sdk');
if (config.has('aws') && config.get('aws').credentials) {
  AWS.config.update(config.get('aws').credentials);
}
const s3 = new AWS.S3();
const s3config = config.has('aws') ? config.get('aws').s3 : null;

module.exports = function(filename, body) {
  return new Promise(function(resolve, reject) {
    const contentType = getContentTypeOfFile(filename);
    let params = {
      Bucket: s3config.bucket,
      ContentType: contentType,
      Key: filename,
      ACL: 'public-read',
      StorageClass: 'STANDARD',
      Body: body
    };
    console.log('putObject');
    s3.putObject(params, function(err, data) {
      console.log('callback', err, data);
      if (err) {
        logger.error(err.statusCode, err);
        resolve();
      }
      else {
        resolve(data);
      }
    });
  });
}
