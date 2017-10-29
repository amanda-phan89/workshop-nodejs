var express = require('express');
var router = express.Router();
var HomePage = require('../controllers/home_page');

/* GET home page. */
router.get('/', HomePage.index);
router.get('/crawl', HomePage.crawl);

module.exports = router;
