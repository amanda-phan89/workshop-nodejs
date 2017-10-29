const fs = require('fs');
const http = require('http');
const cheerio = require('cheerio');
const Utils = require('../helpers/utils');

class DownloadImage {

  downloadFile(dir, url, callbackDownload) {
    const file_name = url.substr(url.lastIndexOf('/') + 1);
    const source = dir + file_name.substr(0, file_name.lastIndexOf('.')) + '/';
    Utils.createFolder(source);

    const file = fs.createWriteStream(source + file_name);
    const data = {
      success: true,
      url: url,
      file_name: file_name,
      source: source
    };

    Utils.adapterRequest(url).get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        this.closeFile(file, () => {
          callbackDownload(null, data);
        });
      } else {
        data.success = false;
        callbackDownload(null, data);
      }
    })
    .on('error', () => {
      callbackDownload(`GET request error: ${url}`);
    });
  }

  closeFile(file, callback) {
    file.on('finish', () => {
      file.close(function () {
        callback(...arguments);
      });
    });
  }

  downloadHtml (url, callback) {
    var data = {
      success: true,
      imgUrls: []
    };
    Utils.adapterRequest(url).get(url, (response) => {
      if (response.statusCode === 200) {
        var body = '';
        response.on('data',function(chunk){
          body += chunk.toString();
        });
        response.on('end',function(){
          var $ = cheerio.load(body);
          $('img').each(function(i) {
            var fullImgUrl = url + $(this).attr('src');
            data.imgUrls.push(fullImgUrl);
          });
          callback(null, data);
        });
      } else {
        callback('ERROR_DOWNLOAD_HTML: request to ' + url + ' failed with status code ' + response.statusCode);
        var body = '';
        response.on('data',function(chunk){
          body += chunk.toString();
        });
        console.log('Body: ' + body);
      }
    })
    .on('error', () => {
      callback('ERROR_DOWNLOAD_HTML: request to ' + url + ' failed');
    });
  }
}

module.exports = new DownloadImage();
