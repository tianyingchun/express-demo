var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);
var dataProvider = require("../services/dataProvider");
var OrderModel = require("../models/Order");
var orderService = dataProvider.get("order");

// match /order/list
router.get('/list', listAllOrders);

function listAllOrders(req, res, next) {
    debug("ddddddddd")
    orderService.findAll(function(orders) {
        if (base.dbRequestSuccess(orders)) {
            res.render('orders/list', {
                orders: orders
            });
        } else {
            res.render('error', base.errorPageModel("find all orders exception!", orders.error));
        }
    });
}

module.exports = router;
