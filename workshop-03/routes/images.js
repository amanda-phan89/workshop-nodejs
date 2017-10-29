var express = require('express');
var router = express.Router();
var Images = require('../controllers/images')

router.get('/deleteAll', Images.deleteAll);

router.get('/:imgName', Images.get);

router.post('/', Images.crawlHtml.bind(Images));

module.exports = router;
