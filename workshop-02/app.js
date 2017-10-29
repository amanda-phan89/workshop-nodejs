var downloadHelper = require('./helpers/downloadImage');
var resizeImage = require('./helpers/resizeImage');
var utils = require('./helpers/Utils');

var urls = [
  'http://www.planwallpaper.com/static/images/blue_fire_deviantart_zippo_depth_of_field_lighters_desktop_1280x1024_hd-wa_tbMipBi.jpg',
  'http://www.planwallpaper.com/static/images/11-sea-beach-sand-wallpaper_w80EYH0.jpg',
  'http://www.planwallpaper.com/static/images/new-wallpaper-3_lA2aDVm.jpg'
];

var source = './images/';
var dest = './new_images/';

var widths = [100, 300, 400];

console.log('Download started');
utils.createFolder(source)
  .then(() => {
    return utils.createFolder(dest);
  })
  .then(() => {
    var tasks = [];

    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];
      var task = downloadHelper.downloadFile(source, url);
      tasks.push(task);
    }

    return Promise.all(tasks);
  })
  .then((data) => {
    var files = [];
    for (var index in data) {
      var item = data[index];
      if (item.success === true) {
        console.log('Download success: ' + item.url);
        files.push(item.file_name);
      } else {
        console.log('Download failed: ' + item.url);
      }
    }
    console.log('Download finish');

    //resize images
    console.log('Resize starting');
    resizeImage.init({
      widths: widths,
      dest: dest
    });
    var tasks = [];
    for (var index in files) {
      var filename = files[index];
      tasks.push(resizeImage.handleResizeImage(source, filename));
    };
    return Promise.all(tasks);
  })
  .then((results) => {
    for (var i in results) {
      var result = results[i];
      for (var j in result) {
        var newFile = result[j];
        if (newFile.success) {
          console.log('Resizing ' + newFile.filename + ' to ' + newFile.width + ' x ' + newFile.height);
        } else {
          console.log('Cannot resize ' + newFile.filename + ' to ' + newFile.width + ' x ' + newFile.height);
        }
      }
    }
    console.log('Resize finish');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
