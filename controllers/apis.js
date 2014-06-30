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
