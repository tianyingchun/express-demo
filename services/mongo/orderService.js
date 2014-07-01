var util = require('util');
var mongoose = require('mongoose');
var exception = require('../../helpers/exception');
var _ = require('underscore');
var OrderModel = require("../../models/Order");
var productService = require("./productService")();
var Schema = mongoose.Schema;
// define product schema.
var orderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    totalAmount: String,
    createDate: {
        type: Date,
        default: Date.now
    },
    products: mongoose.Schema.Types.Mixed
});
// order model.
var MogoOrder = mongoose.model('order', orderSchema);

function OrderProvider() {
    var modelConverter = function(order) {
        var _model = new OrderModel();
        _model = _.extend(_model, order);
        return _model;
    };

    var fetchProductQty = function(id, orderCfg) {
        var qty = 0;
        for (var i = 0; i < orderCfg.length; i++) {
            var cfg = orderCfg[i];
            if (cfg.pId == id) {
                qty = cfg.qty || 0;
                break;
            }
        };
        return qty;
    }
    // get order detail information. include product detail, subtotal
    // {subtotal:10, products:[]}
    var calOrderProductItem = function(orderCfg, callback) {
        if (_.isArray(orderCfg)) {
            var pIds = [];
            for (var i = 0; i < orderCfg.length; i++) {
                var item = orderCfg[i];
                pIds.push(item.pId);
            };
            productService.findProductsByIds(pIds, function(result) {
                if (result.failed) {
                    // RETURN error model.
                    callback(result);
                } else {
                    // calculating....
                    util.debug("get order products info: ", result);
                    var total = 0;
                    var products = [];
                    for (var i = 0; i < result.length; i++) {
                        var item = result[i];
                        var qty = fetchProductQty(item._id, orderCfg);
                        var subtotal = parseFloat(item.unitPrice) * qty;
                        total += subtotal;
                        products.push({
                            productId: item._id.toString(),//convert objectId to id string.
                            name: item.name,
                            description: item.description,
                            unitPrice: item.unitPrice,
                            purchaseQty: qty
                        });

                        util.debug(util.format("order item id:%s, unitPrice: %s, qty:%s, subtotal:%s", item._id, item.unitPrice, qty, subtotal));
                    };
                    callback({
                        total: total,
                        products: products
                    });
                }
            });
        } else {
            callback(exception.getErrorModel(new Error("the orderCfg data exception!")));
        }
    }
    /**
     * place an order
     * @param  {array} orderData [{pId:"", qty:''}]
     */
    this.create = function(orderData, callback) {
        if (_.isArray(orderData)) {
            var _self = this;
            // get real order product information from server.
            calOrderProductItem(orderData, function(orderDetail) {
                if (orderDetail.failed) {
                    console.log("order detail by product info error!");
                    callback(orderDetail);
                } else {
                    var totalAmount = orderDetail.total;
                    var products = orderDetail.products;
                    // place an order save it to database.
                    var order = new OrderModel();
                    order.orderId = require("../../helpers/utils").uuid();
                    order.totalAmount = totalAmount.toFixed(2);
                    order.products = products;
                    console.log("order:", JSON.stringify(order))
                    // save order detail information.
                    _self.save(order, callback);
                }
            });

        } else {
            console.log("the order data must be array[{pId:'', qty:1}]")
        }
    };
    this.save = function(order, callback) {
        var order = new MogoOrder(order);
        order.save(function(err, model) {
            if (err) {
                callback(exception.getErrorModel(err));
            } else {
                callback(modelConverter(model));
            }
        });
    };
    this.findOrderById = function(orderId) {
        // body...
    };
};

module.exports = function() {
    return new OrderProvider();
};
