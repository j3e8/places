module.exports = function(base64Data) {
  const base64prefix = base64Data.substring(0, base64Data.indexOf('base64,') + 7);
  const fileType = base64prefix.substring(base64prefix.indexOf('/') + 1, base64prefix.indexOf(';'));
  const extensionMatch = fileType.match(/[a-z0-9]+/i);
  const extension = extensionMatch ? extensionMatch[0] : fileType;
  return extension == 'jpeg' ? 'jpg' : extension;
}
