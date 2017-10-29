var fs = require('fs');
var http = require('http');

var downloadImage = (function(){

  function downloadFile(dir, url) {
    return new Promise((resolve, reject) => {
      var file_name = url.substr(url.lastIndexOf('/') + 1);
      var file = fs.createWriteStream(dir + file_name);
      var data = {
        success: true,
        url: url,
        file_name: file_name
      };

      http.get(url, function(response) {
        if (response.statusCode === 200) {
          response.pipe(file);
          closeFile(file, function(){
            resolve(data);
          });
        } else {
          data.success = false;
          resolve(data);
        }
      })
      .on('error', () => {
        reject('GET request error: ' + url);
      });
    });
  }

  function closeFile(file, callback) {
    file.on('finish', function() {
      file.close(function() {
        callback.apply(null, arguments);
      });
    });
  }

  return {
    downloadFile: downloadFile
  };
})();

module.exports = downloadImage;
