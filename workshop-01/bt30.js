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
    gm(source + filename).size(function(err, values) {
      if (err) {
        console.log('Error identifying file size: ' + err);
      } else {
        console.log(filename + ':' + values);
        var aspect = (values.width / values.height);
        widths.forEach(function(width, widthIndex) {
          var height = Math.round(width / aspect);
          console.log('resizing ' + filename + ' to ' + width + ' x ' + height);
          this.resize(width, height).write(dest + 'w' + width + '_' + filename, function(err) {
            if (err) {
              console.log('Error writing file: ' + filename );
            }
          })
        }.bind(this))
      }
    })
  })
});
