var express = require('express');
var router = express.Router();
var config = require("../config")();
var debug = require('debug')(config.appName);

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;
