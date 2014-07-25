var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);
var dataProvider = require("../services/dataProvider");
var ProductModel = require("../models/Product");
var productService = dataProvider.get("product");

// match /product/create
router.get('/create', createProductUI);
router.post('/create', createProduct);
// match /product/list
router.get('/list', listAllProducts);
router.get('/', listAllProducts);


/**
 * List all products
 *
 */

function listAllProducts(req, res) {
    productService.findAll(function(result) {
        if (base.dbRequestSuccess(result)) {
            base.renderPageModel(req, res, 'products/index', {
                products: result
            });
        } else {
            base.renderPageModel(req, res, 'error', base.errorPageModel("find all product exception!", result.error));
        }
    });
}

/**
 * For create new product ui page.
 */

function createProductUI(req, res) {
    base.renderPageModel(req, res, 'products/create', {});
};
/**
 * Create new products.
 * @param  {request} req http request.
 * @param  {response} res http response
 * @return {void}
 */

function createProduct(req, res) {
    var _product = new ProductModel();
    var body = req.body || {};
    var name = body.name;
    var pictureUrl = body.pictureUrl;
    var description = body.description;
    var unitPrice = parseFloat(body.unitPrice);
    var status = body.isAvailable && body.isAvailable == "on" ? 1 : 0;

    _product = base.mixin(_product, {
        name: name,
        pictureUrl: pictureUrl,
        description: description,
        unitPrice: unitPrice,
        status: status,
        date: Date.now()
    });
    // save product infomation to database.
    productService.addProduct(_product, function(result) {
        if (base.dbRequestSuccess(result)) {
            base.renderPageModel(req, res, 'products/create', {
                success: "ok",
                data: result
            });
        } else {
            base.renderPageModel(req, res, 'error', base.errorPageModel("save new product to db failed!", result.error));
        }
    });

}

module.exports = router;
