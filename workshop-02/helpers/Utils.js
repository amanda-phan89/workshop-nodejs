var fs = require('fs');

var Utils = (function(){
  function createFolder(dir) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        resolve();
      } catch (err) {
        reject('Create folder failed: ' + err);
      }
    });
  }

  return {
    createFolder: createFolder
  };
})();

module.exports = Utils;
