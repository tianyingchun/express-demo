/**
 * Provider base util function for all child controller.
 * @type {[type]}
 */
var security = require("../security/authentication");
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
     * @param  {number} status  the customized status number
     * @param  {string} message error message
     */
    apiErrorOutput: function(res, status, message) {
        res.json(status, {
            status: status,
            info: null,
            message: message || "The request internal exception!"
        });
    },
    dbRequestSuccess: function(result) {
        return result.failed || true;
    }
}
