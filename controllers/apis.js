var express = require('express');
var router = express.Router();
var config = require("../config")();
var debug = require('debug')(config.appName);
var security = require("../security/authentication");

// authenticating api security.
router.route("*").all(security.authApis);

/* GET all apis interface. */
router.get("/", function(req, res) {
    res.json({
        title: "title",
        password: "password"
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
        next(new Error('not implemented'));
    })
    .delete(function(req, res, next) {
        next(new Error('not implemented'));
    });

module.exports = router;
