var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);
var dataProvider = require("../services/dataProvider");
// var productModel = require("../models/Product");
var productService = dataProvider.get("product");


// remote order service.
var remoteOrderService = dataProvider.get("remote", "order");

/* GET home page. list all products */
router.get('/', function(req, res) {

    // list all products.
    productService.findAll(function(result) {
        if (base.dbRequestSuccess(result)) {
            // render data to page.
            base.renderPageModel(req, res, 'products/index', {
                products: result
            });
        } else {
            base.renderPageModel(req, res, 'error', base.errorPageModel("find all products exception!", result.error));
        }
    });
});
module.exports = router;
