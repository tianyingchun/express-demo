var express = require('express');
var router = express.Router();
var config = require("../config")();
var debug = require('debug')(config.appName);
var base = require("./base");
var dataProvider = require("../services/dataProvider");
var productModel = require("../models/Product");
/* GET home page. */
router.get('/', function(req, res) {
    var productService = dataProvider.get("product");
    var _product = new productModel();
    _product = base.extend(_product, {
        name: "testing..",
        pictureUrl: "http://www.baidu.com/",
        description: "testing description",
        unitPrice: 0,
        status: 1,
        date: Date.now()
    });
    productService.addProduct(_product, function(result) {
        if (base.dbRequestSuccess(result)) {
            res.render('index', {
                title: 'Express'
            });
        }
    });
});

module.exports = router;
