var express = require('express');
var router = express.Router();
var config = require("../config")();
var debug = require('debug')(config.appName);
var base = require("./base");
var dataProvider = require("../services/dataProvider");
var productModel = require("../models/Product");
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Welcome Express'
    });
});
module.exports = router;
