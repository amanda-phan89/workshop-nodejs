var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

var resizeImage = (function(){
  var dest = '';
  var widths = [];

  function getAllFiles(source) {
    return new Promise((resolve, reject) => {
      fs.readdir(source, function(err, files) {
        if (err) {
          reject('Error finding files: ' + err);
          return;
        }
        resolve(files);
      });
    });
  }

  function handleResizeImage (source, filename) {
    return new Promise((resolve, reject) => {
      gm(source + filename).size(function(err, values) {
        if (err) {
          reject('Error identifying file size: ' + err);
          return;
        }

        var aspect = (values.width / values.height);
        var tasks = [];
        for (var widthIndex in widths) {
          var width = widths[widthIndex];
          var height = Math.round(width / aspect);
          tasks.push(writeFile(this, filename, width, height));
        }

        Promise.all(tasks)
          .then((results) => {
            resolve(results);
          })
          .catch(reject);
      });
    });
  }

  function writeFile (file, filename, width, height) {
    return new Promise((resolve) => {
      var newFilename = 'w' + width + '_' + filename;
      var data = {
        filename: filename,
        width: width,
        height: height,
        success: true
      };
      file.resize(width, height)
        .write(dest + newFilename, function(err) {
          if (err) {
            data.success = false;
            data.error = err;
          }
          resolve(data);
        });
    });
  }

  return {
    init: function(options){
      dest = options.dest;
      widths = options.widths;
    },
    handleResizeImage: handleResizeImage,
    getAllFiles: getAllFiles
  };
})();

module.exports = resizeImage;
