const fs = require('fs');

class Utils {
  static createFolder(dir) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        resolve();
      } catch (err) {
        reject(`Create folder failed: ${err}`);
      }
    });
  }
}

module.exports = Utils;
