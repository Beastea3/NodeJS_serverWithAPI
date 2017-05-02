var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.hello = function(req, res) {
    res.send('The time is ' + new Date().toString());
}

module.exports = router;
