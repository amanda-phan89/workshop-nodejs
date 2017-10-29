const fs = require('fs');
const p = require('path');
const url = require('url');

class Utils {
  static adapterRequest(inputUrl) {
    const adapters = {
      'http:': require('http'),
      'https:': require('https'),
    };

    return adapters[url.parse(inputUrl).protocol];
  }

  static createFolder(dir) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      } catch (err) {
        return new Error(`Create folder failed: ${err}`);
      }
  }

  static deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = p.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          Utils.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
}

module.exports = Utils;
