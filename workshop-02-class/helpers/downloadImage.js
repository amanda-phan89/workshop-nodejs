const fs = require('fs');
const http = require('http');

class DownloadImage {

  downloadFile(dir, url) {
    return new Promise((resolve, reject) => {
      const file_name = url.substr(url.lastIndexOf('/') + 1);
      const file = fs.createWriteStream(dir + file_name);
      const data = {
        success: true,
        url,
        file_name: file_name
      };

      http.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          this.closeFile(file, () => {
            resolve(data);
          });
        } else {
          data.success = false;
          resolve(data);
        }
      })
        .on('error', () => {
          reject(`GET request error: ${url}`);
        });
    });
  }

  closeFile(file, callback) {
    file.on('finish', () => {
      file.close(function () {
        callback(...arguments);
      });
    });
  }
}

module.exports = new DownloadImage();
