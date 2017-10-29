var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

var source = './images/';
var dest = './new_images/';

var widths = [100, 300, 400];

fs.readdir(source, function(err, files) {
  if (err) {
    console.log('Error finding files: ' + err);
    return;
  }

  files.forEach(function(filename, fileIndex) {
    console.log(filename);
    identifySize(source, filename)
      .then((data) => {
        var gmObj = data[0];
        var values = data[1];
        var tasks = resizeImage(filename, values, gmObj);
        return Promise.all(tasks);
      })
      .catch((err) => {
        console.log(err);
      });
  })
});

function identifySize(source, filename) {
  return new Promise((resolve, reject) => {
    gm(source + filename).size(function(err, values) {
      if (err) {
        reject('Error identifying file size: ' + err);
      } else {
        resolve([this, values]);
      }
    })
  })
}

function resizeImage (filename, values, gmObj) {
  console.log(filename + ':' + values.width + 'x' + values.height);
  var tasks = [];
  var aspect = (values.width / values.height);
  for (widthIndex in widths) {
    var width = widths[widthIndex];
    var height = Math.round(width / aspect);
    console.log('resizing ' + filename + ' to ' + width + ' x ' + height);
    var resizedFile = gmObj.resize(width, height);
    var newFilename = 'w' + width + '_' + filename;
    tasks.push(writeFile(resizedFile, newFilename));
  }
  return tasks
}

function writeFile (resizedFile, filename) {
  return new Promise((resolve, reject) => {
    resizedFile.write(dest + filename, function(err) {
      if (err) {
        reject('Error writing file: ' + filename );
      }
    })
  });
}
