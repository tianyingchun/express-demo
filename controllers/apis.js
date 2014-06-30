var config = require("../config")();
var base = require("./base");
var express = require('express');
var router = express.Router();
var debug = require('debug')(config.appName);

// the api route controller.

// authenticating api security.
router.route("*").all(base.authApis);

/* GET all apis interface. */
router.get("/", function(req, res) {
    res.json({
        title: "title",
        password: "password"
    });
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
        base.apiErrorOutput(res, 501, 'not implemented');
    })
    .delete(function(req, res, next) {
        base.apiErrorOutput(res, 501, 'not implemented');
    });

module.exports = router;
