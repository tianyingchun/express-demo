var util = require("../../helpers/utils");
var config = require("../../config/index")();
var exception = require('../../helpers/exception');
// formatter.
var format = require('atma-formatter');
var querystring = require('querystring');
var _ = require("underscore");
var debug = require('debug')(config.appName);

var placeOrder = function(mercOrderNo, orderAmount, callback) {
    //yyyyMMddHHmmss
    var orderTime = format("{date:yyyyMMddHHmmss}", {
        date: new Date()
    });
    debug("date:", orderTime); //20140717141815
    // prepare request parameters.
    var params = {
        version: config.version,
        charset: config.charset,
        signMethod: config.signMethod,
        transType: config.transType,
        transCode: config.transCode,
        merchantId: config.merchantId,
        mercOrderNo: mercOrderNo, //"123456789",
        orderAmount: orderAmount * 100, //"0.01", 单位是分
        orderCurrency: config.orderCurrency,
        sameOrderFlag: config.sameOrderFlag,
        orderTime: orderTime, //"20140701180308", //yyyyMMddHHmmss Date.now(),
        backEndUrl: config.backEndUrl,
        frontEndUrl: config.frontEndUrl.replace("{0}",mercOrderNo)
    };
    // new params to remote server.
    var params_New = _.clone(params);

    var signatured = util.signRequest(params);

    debug("signatured string %s", signatured);

    // add signatured string.
    params_New["signature"] = signatured;
    // HTTP POST request.

    callback = callback || function noop() {};

    var localOrderService =  require("../mongo/orderService")();
    util.formPost(config.orderRemoteUri, params_New, function success(data) {
        debug("place order form post: ", JSON.stringify(data));
        var mercOrderNo = data.mercOrderNo;
        var orderTraceNo = data.orderTraceNo;
        // try update local order details.
       localOrderService.update({
            orderId: mercOrderNo,
            orderTraceNo: orderTraceNo
        }, function() {
            callback(data);
        });
    }, function error(err) {
        debug("error:", err)
        callback(exception.getErrorModel(err));
    });
};
// remotely fetch order detail stored in 1qianbao server.
var getOrderInfo = function(orderTraceNo, callback) {
    // prepare request parameters.
    var params = {
        version: config.version,
        charset: config.charset,
        signMethod: config.signMethod,
        transType: "005", //
        merId: config.merchantId,
        orderTraceNo: orderTraceNo
    };
    // new params to remote server.
    var params_New = _.clone(params);

    var signatured = util.signRequest(params);
    // add signatured string.
    params_New["signature"] = signatured;

    util.formPost(config.orderRemoteUri, params_New, function success(data) {
        debug("query order info success: ", JSON.stringify(data));
        callback(data);
    }, function error(err) {
        debug("get order info remotely err: ", err);
        callback(exception.getErrorModel(err));
    });
};

var order = {
    placeOrder: function(orderNo, orderAmount, callback) {
        placeOrder(orderNo, orderAmount, callback);
    },
    queryOrder: function(order, callback) {
        var orderTraceNo = order.orderTraceNo;
        getOrderInfo(orderTraceNo, callback);
    }
};
// all service must be exported an function.
module.exports = function() {
    return order;
};
