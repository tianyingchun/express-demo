var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);
var dataProvider = require("../services/dataProvider");
var productModel = require("../models/Product");

// remote order service.
var remoteOrderService = dataProvider.get("remote", "order");

/* GET home page. */
router.get('/', function(req, res) {
    var signaturedStr = remoteOrderService.placeOrder("123456789", 0.01, function(result) {
    	debug(JSON.stringify(result))
        res.render('index', {
            title: 'Welcome Express' + JSON.stringify(result)
        });
    });

});
module.exports = router;
