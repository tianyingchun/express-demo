/**
 * Provider base util function for all child controller.
 * @type {[type]}
 */
var security = require("../security/authentication");
var exception =require("../helpers/exception");
var _ = require("underscore");

module.exports = {
    name: "base",
    mixin: function(source, target) {
        return _.extend(source || {}, target);
    },
    authApis: function(req, res, next) {
        security.authApis(req, res, next);
    },
    /**
     * Out api error message format
     * @param  {response} res
     * @param  {object} the Error instance.
     */
    apiErrorOutput: function(res, error) {
        exception.writeJSONError(res, error);
    },
    /**
     * capture all api request, and attach response content-Type:'application/json' and other headers
     * @param  {object}   req  http request
     * @param  {object}   res  http response
     * @param  {Function} next next
     */
    apiResponseHeaders: function(req, res, next) {
        res.set({
            "Content-Type": "application/json"
        });
        next();
    },
    /**
     * for all server page error
     * @param  {string} message the error message
     * @param  {object} err     the error object
     * @return {object}         the error.html page.
     */
    errorPageModel: function(message, err) {
        return {
            message: message,
            error: err
        };
    },
    dbRequestSuccess: function(result) {
        return result.failed || true;
    }
}
