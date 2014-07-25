/**
 * Provider base util function for all child controller.
 * @type {[type]}
 */
var security = require("../security/authentication");
var exception = require("../helpers/exception");
var _ = require("underscore");
var path = require('path');
var config = require("../config")();
var debug = require('debug')(config.appName);

/**
 * Get application base url
 * @param  {request} req       http request
 * @param  {quer} queryPath query path  'order/list' -->http://baidu.com:10/virtual/order/list
 */
var getBaseUrl = function(req, queryPath) {
    var rootPath = [req.host.toString()];
    // for production remove port number cause of ngix server.
    if (config.mode == "production" && config.port) {
        rootPath.push(":" + config.port);
    }
    if (config.virtualDir) {
        rootPath.push("/" + config.virtualDir);
    }
    if (queryPath) {
        rootPath.push("/" + queryPath);
    }
    // return
    var baseUrl = req.protocol + "://" + path.normalize(rootPath.join(""));
    debug("getBaseUrl(): ", baseUrl);

    return baseUrl;
};
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
        if (error && error.error) {
            error = error.error;
        }
        exception.writeJSONError(res, error);
    },
    apiOkOutput: function(res, info) {
        if (this.dbRequestSuccess(info)) {
            res.json({
                retCode: 1,
                info: info,
                message: ''
            });
        } else {
            this.apiErrorOutput(res, info.error);
        }
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
    /**
     * capture all page model instance for render server page template.
     * @param {object} request
     * @param {object} response
     * @param {object} model
     */
    renderPageModel: function(req, res, tmpUrl, model) {
        var pageModel = {
            rootUrl: getBaseUrl(req),
            DEV: config.mode == "production" ? false : true
        };
        // new model.
        var newModel = _.extend(pageModel, model);
        // render template url.
        res.render(tmpUrl, newModel);
    },
    getBaseUrl: function(req, queryPath) {
        // return
        return getBaseUrl(req, queryPath);
    },
    dbRequestSuccess: function(result) {
        if (result.failed === true) {
            return false;
        }
        return true;
    }
}
