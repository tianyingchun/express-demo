/**
 * security authentication policy.
 */

var config = require("../config")();
var exception = require("../helpers/exception");
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
            var err = new Error('The api is unauthorized!');
            err.status = 401;
            exception.writeJSONError(res, err);
        }
    }
};
module.exports = authentication;
