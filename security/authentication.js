/**
 * security authentication policy.
 */

var config = require("../config")();
var debug = require('debug')(config.appName);

var apisValidationPassed = function(data) {
    return true;
};

var authentication = {
    authApis: function(req, res, next) {
        debug("api authenticating....");
        var passed = apisValidationPassed({});
        if (passed) {
            next();
        } else {
            res.json(401, {
                status: 401,
                info: null,
                message: "The api is unauthorized!"
            });
        }
    }
};
module.exports = authentication;
