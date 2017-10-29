const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const map = require('async/map');

class ResizeImage {
  constructor( widths) {
    this.widths = widths;
  }

  handleResizeImage(file, callback) {
    const self = this;
    const source = file.source;
    const filename = file.name;
    gm(source + filename).size(function (err, values) {
      if (err) {
        return callback(`Error identifying file size: ${err}`);
      }

      const aspect = (values.width / values.height);
      const gmObj = this;
      map(self.widths,
        function(width, callbackWriteFile) {
          const height = Math.round(width / aspect);
          self.writeFile(gmObj, source, filename, width, height, callbackWriteFile)
        },
        function(err, results) {
          if (err) {
            return callback('writeFile: ' + err);
          }
          callback(null, results);
        }
      )
    })
  }

  writeFile(file, source, filename, width, height, callback) {
    const newFilename = `w${width}_${filename}`;
    const data = {
      source: source.replace('./public', ''),
      filename: filename,
      newFilename: newFilename,
      width: width,
      height: height,
      success: true,
    };

    file.resize(width, height)
      .write(source + newFilename, (err) => {
        if (err) {
          data.success = false;
          data.error = err;
        }
        callback(null, data);
      });
  }
}

module.exports = ResizeImage;
