var util = require("./utils");
var config = require("../../config/index")();
var debug = require('debug')(config.appName);
var exception = require('../exception');

var placeOrder = function(mercOrderNo, orderAmount, callback) {

    // prepare request parameters.
    var params = {
        version: config.version,
        charset: config.charset,
        signMethod: config.signMethod,
        transType: config.transType,
        transCode: config.transCode,
        merchantId: config.merchantId,
        mercOrderNo: mercOrderNo, //"123456789",
        orderAmount: orderAmount, //"0.01",
        orderCurrency: config.orderCurrency,
        sameOrderFlag: config.sameOrderFlag,
        orderTime: Date.now(),
        backEndUrl: config.backEndUrl,
        frontEndUrl: config.frontEndUrl
    };
    var signatured = util.signRequest(params);
    // add signatured string.
    params["signature"] = signatured;

    debug("signatured string %s", signatured);
    // HTTP POST request.

    callback = callback || function noop() {};

    util.formPost("http://localhost:3000/api", params, function success(data) {
        debug("form post: ", data);
        callback(data);
    }, function error(err) {
    	debug("error:", err)
        callback(exception.getErrorModel(err));
    });
};

var order = {
    placeOrder: function(oderNo, orderAmount, callback) {
        placeOrder(oderNo, orderAmount, callback);
    }
};
// all service must be exported an function.
module.exports = function() {
    return order;
};
