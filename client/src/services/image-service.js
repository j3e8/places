app.service("ImageService", [function() {
  var ImageService = {};
  var THUMBNAIL_SIZE = 150;

  ImageService.createThumbnail = function(base64Image, callback) {
    var img = new Image();
    img.src = base64Image;
    img.onload = function() {
      var thumbnailCanvas = document.createElement("canvas");
      var aspect = img.width / img.height;
      if (img.width > img.height) {
        thumbnailCanvas.width = THUMBNAIL_SIZE;
        thumbnailCanvas.height = thumbnailCanvas.width / aspect;
      }
      else {
        thumbnailCanvas.height = THUMBNAIL_SIZE;
        thumbnailCanvas.width = thumbnailCanvas.height * aspect;
      }
      var ctx = thumbnailCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
      var thumb64 = thumbnailCanvas.toDataURL('image/jpeg', 1);
      if (callback) {
        callback(thumb64);
      }
    }
  }

  return ImageService;
}];
