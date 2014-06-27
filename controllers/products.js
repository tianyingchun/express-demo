var express = require('express');
var router = express.Router();
var config = require("../config")();
var debug = require('debug')(config.appName);
var base = require("./base");
var dataProvider = require("../services/dataProvider");
var ProductModel = require("../models/Product");
var productService = dataProvider.get("product");

// match /product/create
router.get('/create', createProduct);
// match /product/list
router.get('/list', listAllProducts);


/**
 * List all products
 * 
 */
function listAllProducts(req, res) {
    productService.findAll(function(result) {
        if (base.dbRequestSuccess(result)) {
            res.render('products/index', {products:result});
        } else {
            res.render('error', {
            	message: "find all product exception!",
                error: result.error
            });
        }
    });
}

/**
 * Create new products.
 * @param  {request} req http request.
 * @param  {response} res http response
 * @return {void}
 */

function createProduct(req, res) {
    var _product = new ProductModel();
    _product = base.mixin(_product, {
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
        } else {
            res.render('index', {
                title: 'Error Express'
            });
        }
    });
}

module.exports = router;
