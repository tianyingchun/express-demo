var mongoose = require('mongoose');
var exception = require('../exception');
var _ = require('underscore');
var ProductModel = require("../../models/Product");

var Schema = mongoose.Schema;
// define product schema.
var productSchema = new Schema({
    name: String,
    pictureUrl: String,
    description: String,
    unitPrice: Number,
    status: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
});
// product model.
var MogoProduct = mongoose.model('product', productSchema);


function ProductProvider() {
    var modelConverter = function (product) {
        var _model = new ProductModel();
        _model= _.extend(_model, product);
        return _model;
    };
    var listConverter = function (products) {
        var result = [];
        for (var i = 0; i < products.length; i++) {
            result.push(modelConverter(products[i]));
        };
        return result;
    };

    /**
     * api:  findProductById.
     * @param  {number} productId the
     * @return {product}   the instance of product model.
     */
    this.findProductById = function(productId) {

    };
    this.findAll = function(callback) {
        MogoProduct.find(function (err, products) {
            if (err) {
                callback(exception.getErrorModel(err));
            } else {
                var list = listConverter(products);
                callback(list);
            }
        });
    };
    this.updateProduct = function(product) {

    };
    this.deleteProduct = function(productId) {

    };
    this.addProduct = function(product, callback) {
        var product = new MogoProduct(product);
        product.save(function(err, model) {
            if (err) {
                callback(exception.getErrorModel(err));
            } else {
                callback(model);
            }
        });
    };
}


/**
 * Expose product service interface.
 * all service must be exported an function.
 * @type {Object}
 */
module.exports = function() {
    return new ProductProvider();
};
