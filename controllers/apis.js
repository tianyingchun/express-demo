var util = require("util");
var path = require("path");
var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);
var dataProvider = require("../services/dataProvider");

// the api route controller.

// authenticating api security.
router.route("*").all(base.apiResponseHeaders, base.authApis);

/* GET all apis interface. */
router.get("/", function(req, res) {
    res.json({
        title: "Nothing",
        body: "default apis."
    });
});

/** 
 * API: match /product/:id
 */
router.param("product_id", function(req, res, next, id) {
    // sample user, would actually fetch from DB, etc...
    var productService = dataProvider.get("product");
    productService.findProductById(id, function(result) {
        if (!base.dbRequestSuccess(result)) {
            req.product = null;
            next();
        } else {
            var err = new Error("can't find corresponding product!");
            err.status = 500;
            base.apiErrorOutput(res, err);
        }
    });
});
router.get("/product/:product_id", function(req, res) {
    var product = req.product;
    base.apiOkOutput(res, product);
});

/**
 * create new order saved it to db
 */
router.post("/order/create", function(req, res) {
    var orderCfg = req.body;
    debug("`/order/create` params:", JSON.stringify(orderCfg));
    var orderService = dataProvider.get("order");

    orderService.create(orderCfg, function(result) {
        util.debug("create new order done!!!!");
        if (base.dbRequestSuccess(result)) {
            base.apiOkOutput(res, result);
        } else {
            base.apiErrorOutput(res, result.error);
        }
    });
});
// place an 1qianbao order.
router.post("/order/1qianbao/placeorder", function(req, res) {
    var remoteOrder = dataProvider.get("remote", "order");
    var orderNo = req.body.orderId;
    var orderAmount = req.body.totalAmount;
    debug("1qianbao order params:", {
        orderNo: orderNo,
        orderAmount: orderAmount
    });
    // remote place an order.
    remoteOrder.placeOrder(orderNo, orderAmount, function(result) {
        if (base.dbRequestSuccess(result)) {
            base.apiOkOutput(res, result);
        } else {
            base.apiErrorOutput(res, result.error);
        }
    });
});
/**
 * Generated new qr code image path
 * @param  {object} req request
 * @param  {object} res response
 */
router.get("/images/qrcode", function(req, res) {
    // images qrcode service query string.
    debug("query:", req.query);

    var fileName = req.query.fileName;
    var transId = req.query.transId;
    var value = config.cachier.replace("{transId}", transId);
    var qrCode = require("../helpers/utils").qrEncoder;
    qrCode(value, fileName, function(result) {
        if (base.dbRequestSuccess(result)) {

            // http qrcode url path.
            var filePath = base.getBaseUrl(req, result.replace("public", "/static"));

            debug("qrCode Http url:", filePath);
            base.apiOkOutput(res, filePath);
        } else {
            base.apiErrorOutput(res, result.error);
        }
    });
});
// for testing purpose,directly generate qrcode.
router.get('/images/qrcode_directly', function(req, res) {
    var qr = require('qr-image');
    var transId = req.query.transId;

    var code = qr.image(config.cachier.replace("{transId}", transId), {
        type: 'png'
    });
    res.type('png');
    code.pipe(res);
});

// for testing purpose.
router.post("/", function(req, res) {
    debug("testpost params:", JSON.stringify(req.body));
    res.json({
        result: 'testing post form'
    });
});

router.param("user_id", function(req, res, next, id) {
    // sample user, would actually fetch from DB, etc...
    req.user = {
        id: id,
        name: 'TJ'
    };
    next();
});
/**
 * For user apis
 */
router.route('/users/:user_id')
    .all(function(req, res, next) {
        // runs for all HTTP verbs first
        // think of it as route specific middleware!
        // do nothing.

        next()
    })
    .get(function(req, res, next) {
        res.json(req.user);
    })
    .put(function(req, res, next) {
        // just an example of maybe updating the user
        req.user.name = req.params.name;
        // save user ... etc
        res.json(req.user);
    })
    .post(function(req, res, next) {
        var err = new Error("not implemented!");
        err.status = 501;
        base.apiErrorOutput(res, err);
    })
    .delete(function(req, res, next) {
        var err = new Error("not implemented!");
        err.status = 501;
        base.apiErrorOutput(res, err);
    });

module.exports = router;
