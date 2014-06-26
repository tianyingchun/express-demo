/**
 * security authentication policy.
 */

var config = require("../config")();
var debug = require('debug')(config.appName);
var authentication = {
    authApis: function(req, res, next) {
        debug("api authenticating....");
        next();
    }
};
module.exports = authentication;
