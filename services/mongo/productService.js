var mongoose = require('mongoose');
var exception = require('../exception');
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
var Product = mongoose.model('product', productSchema);


function ProductProvider() {
    /**
     * api:  findProductById.
     * @param  {number} productId the
     * @return {product}   the instance of product model.
     */
    this.findProductById = function(productId) {

    };
    this.findAll = function(callback) {
        var list = [{
            name: 'sdfsf',
            password: ''
        }]
        callback(list);
    };
    this.updateProduct = function(product) {

    };
    this.deleteProduct = function(productId) {

    };
    this.addProduct = function(product, callback) {
        var product = new Product(product);
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
 * @type {Object}
 */
module.exports = function() {
    return new ProductProvider();
};
