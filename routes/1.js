var express = require('express');
var router = express.Router();

/* GET hello page. */
router.get('/', function(req, res) {
    res.send('The time is ' + new Date().toString());
})

module.exports = router;
