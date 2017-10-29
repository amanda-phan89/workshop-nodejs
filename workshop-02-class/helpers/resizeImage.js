const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });

class ResizeImage {
  constructor(dest, widths) {
    this.dest = dest;
    this.widths = widths;
  }

  getAllFiles(source) {
    return new Promise((resolve, reject) => {
      fs.readdir(source, (err, files) => {
        if (err) {
          reject(`Error finding files: ${err}`);
          return;
        }
        resolve(files);
      });
    });
  }

  handleResizeImage(source, filename) {
    const self = this;
    return new Promise((resolve, reject) => {
      gm(source + filename).size(function (err, values) {
        if (err) {
          reject(`Error identifying file size: ${err}`);
          return;
        }

        const aspect = (values.width / values.height);
        const tasks = [];
        for (const widthIndex in self.widths) {
          const width = self.widths[widthIndex];
          const height = Math.round(width / aspect);
          tasks.push(self.writeFile(this, filename, width, height));
        }

        Promise.all(tasks)
          .then((results) => {
            resolve(results);
          })
          .catch(reject);
      });
    });
  }

  writeFile(file, filename, width, height) {
    return new Promise((resolve) => {
      const newFilename = `w${width}_${filename}`;
      const data = {
        filename,
        width,
        height,
        success: true,
      };
      file.resize(width, height)
        .write(this.dest + newFilename, (err) => {
          if (err) {
            data.success = false;
            data.error = err;
          }
          resolve(data);
        });
    });
  }
}

module.exports = ResizeImage;
