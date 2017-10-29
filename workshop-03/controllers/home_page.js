const BaseController = require('./base_controller');
const Images = require('../models/images');

class HomePage extends BaseController
{
  index(req, res, next) {
    Images.find({width: 300}, function(err, result){
      res.render('pages/home', { title: 'Images', data: result});
    });
  }

  crawl(req, res, next) {
    return res.render('pages/crawl', { title: 'Crawling images'});
  }
}

module.exports = new HomePage();
