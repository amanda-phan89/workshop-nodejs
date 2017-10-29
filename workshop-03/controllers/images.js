const BaseController = require('./base_controller');
const DownloadImage = require('../helpers/downloadImage');
const ResizeImage = require('../helpers/resizeImage');
const Utils = require('../helpers/utils');
const waterfall = require('async/waterfall');
const map = require('async/map');
const ImageModel = require('../models/images');

class Images {

  crawlHtml(req, res, next) {
    var source = './public/images/';
    var widths = [100, 300, 400];
    var urlHtml = req.body.url || 'http://www.planwallpaper.com';
    waterfall([
      function(callback){
        Utils.createFolder(source);
        callback(null, urlHtml);
      },
      DownloadImage.downloadHtml,
      function(result, callback) {
        map(result.imgUrls,
          function(url, callbackMap) {
            DownloadImage.downloadFile(source, url, callbackMap);
          },
          function(err, results) {
            callback(err, results);
          }
        )
      },
      function(result, callback) {
        var files = [];
        for (var index in result) {
          var item = result[index];
          if (item.success) {
            files.push({name: item.file_name, source: item.source});
          }
        }

        var resizeImage = new ResizeImage(widths);
        map(files,
          resizeImage.handleResizeImage.bind(resizeImage),
          function(err, results) {
            callback(err, results);
          }
        )
      },
      function(results, callback) {
        var dataInsert = [];
        for (var i in results) {
          var result = results[i];
          for (var j in result) {
            var newFile = result[j];
            if (newFile.success) {
              dataInsert.push(newFile);
            }
          }
        }
        ImageModel.insert(dataInsert, (err, data) => {
          callback(err, data);
        });
      }
    ], function (err, result) {
      if (err) {
        console.log('crawlHtml: ' + err);
      }
      res.redirect('/');
    });
  }

  get(req, res, next) {
    var imgName = req.params.imgName;
    ImageModel.find(
      {"filename" : {$regex : imgName + ".*"}},
      function(err, result) {
        res.render('pages/detail', {title: 'Detail', data: result});
      }
    );
  }

  deleteAll(req, res, next) {
    ImageModel.delete(null, function() {
      Utils.deleteFolderRecursive('./public/images/');
      res.json({res: "successfully"});
    });
  }
}

module.exports = new Images();
