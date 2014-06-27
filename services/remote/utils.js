/**
 * ALl util helper method for signature remote place order for 1qianbao.com
 * @return {[type]} [description]
 */

var crypto = require('crypto');
var config = require("../../config")();
// serialize object.
var querystring = require('querystring');
var debug = require('debug')(config.appName);

// signmethods mapping.
var signMethodMapping = {
    "SHA-256": "sha256"
};
/**
 * sort object keys asc, desc
 * @param  {object} params required.
 * @param  {string} sortType  'asc', 'desc', undefined.
 * @return {object}        sorted object by keys.
 */
var sort = function(params, sortType) {
    if (Object.prototype.toString.call(params) === "[object Object]") {
        if (typeof sortType == "undefined" || sortType === null) {
            // keep original params.
            return params;
        } else {
            var sortedKeys = [],
                result = {};
            switch (sortType) {
                case "asc":
                    sortedKeys = Object.keys(params).sort();
                    break;
                case "desc":
                    sortedKeys = Object.keys(params).sort().reverse();
                    break;
            }
            for (var i = 0; i < sortedKeys.length; i++) {
                var key = sortedKeys[i];
                result[key] = params[key];
            };
            return result;
        }

    } else {
        debug("the sign request could't be empty...")
        return {};
    }
};
var signRequest = function(requestParams) {
    var merchantKey = config.merchantKey;
    // sort param key asc
    requestParams = sort(requestParams, 'asc');

    var signatureStr = querystring.stringify(requestParams) + merchantKey;

    // default signmethod.
    var signMethod = signMethodMapping[config.signMethod].toLowerCase() || "sha256";

    debug("unsignatured string: %s signMethod:%s", signatureStr, signMethod);

    // signatureStr + merchantKey ==>digest() output signed string.
    return crypto.createHash(signMethod).update(signatureStr).digest("hex");

};

var util = {
    // return signatured request parameters string.
    signRequest: signRequest
};
module.exports = util;
