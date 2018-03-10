module.exports = function getExtensionOfFilename(file) {
  if (!file) {
    return '';
  }
  if (file.lastIndexOf('.') == -1) {
    return '';
  }
  return file.substring(file.lastIndexOf('.') + 1);
}
