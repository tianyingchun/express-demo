var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);
var dataProvider = require("../services/dataProvider");
var OrderModel = require("../models/Order");
var orderService = dataProvider.get("order");
var remoteOrderService = dataProvider.get("remote", "order");
// match /order/list
router.get('/list', listAllOrders);
router.get('/detail/:orderId', showOrderDetail);

function listAllOrders(req, res, next) {
    orderService.findAll(function(orders) {
        if (base.dbRequestSuccess(orders)) {
            base.renderPageModel(req, res, 'orders/list', {
                orders: orders
            });
        } else {
            base.renderPageModel(req, res, 'error', base.errorPageModel("find all orders exception!", orders.error));
        }
    });
}

function showOrderDetail(req, res, next) {
    var orderId = req.params.orderId;
    orderService.findOrderById(orderId, function(result) {
        if (!base.dbRequestSuccess(result)) {
            base.renderPageModel(req, res, 'error', base.errorPageModel("find order detail exception!", result.error));
        } else {
            // remote query order status to check if order has been placed or paid.
            var orderId = result.orderId;
            var orderTraceNo = result.orderTraceNo;
            // for unpaid order we goto query order status
            if (result.status != "paid") {
                remoteOrderService.queryOrder({
                    orderId: orderId,
                    orderTraceNo: orderTraceNo
                }, function(result) {
                    if (!base.dbRequestSuccess(result)) {
                        base.renderPageModel(req, res, 'error', base.errorPageModel("query order detail remotely exception!", result.error));
                    } else {
                        // qeury succcess.
                        if (result.respCode == "0000") {
                            switch (result.orderStatus) {
                                case "00": // 已支付 paid
                                    orderService.update({
                                        "orderId": orderId,
                                        "status": "paid"
                                    }, function(orderDetail) {
                                        base.renderPageModel(req, res, 'orders/detail', {
                                            order: orderDetail
                                        });
                                    });
                                    break;
                                case "01": //未支付 unpaid
                                    orderService.update({
                                        "orderId": orderId,
                                        "status": "unpaid"
                                    }, function(orderDetail) {
                                        debug("order status: ", orderDetail);
                                        // generate qr code.
                                        base.renderPageModel(req, res, 'orders/detail', {
                                            order: orderDetail
                                        });
                                    });
                                    break;
                                case "03": //订单创建失败
                                    orderService.update({
                                        "orderId": orderId,
                                        "status": "failed"
                                    }, function(orderDetail) {
                                        base.renderPageModel(req, res, 'orders/detail', {
                                            order: orderDetail
                                        });
                                    });
                                    break;
                            }
                        } else {
                            base.renderPageModel(req, res, 'error', base.errorPageModel("query failed!", result.error));
                        }
                    }
                });
            } else {
                base.renderPageModel(req, res, 'orders/detail', {
                    order: orderDetail
                });
            }
        }
    })
}
module.exports = router;
