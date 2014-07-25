/**
 * ALl util helper method for signature remote place order for 1qianbao.com
 * @return {[type]} [description]
 */

var crypto = require('crypto');
// serialize object.http://nodejs.org/api/querystring.html
var querystring = require('querystring');
// https://github.com/mikeal/request  Request -- Simplified HTTP client
// http://nodejs.cn/npm/request/
var request = require("request");
var util = require('util');
var path = require("path");
var fs = require('fs');

var config = require("../config")();
var debug = require('debug')(config.appName);
var exception = require("./exception");
// signmethods mapping.
var signMethodMapping = {
    "SHA-256": "sha256"
};

var isObject = function(params) {
    return Object.prototype.toString.call(params) === "[object Object]"
};
/**
 * sort object keys asc, desc
 * @param  {object} params required.
 * @param  {string} sortType  'asc', 'desc', undefined.
 * @return {object}        sorted object by keys.
 */
var sort = function(params, sortType) {
    if (isObject(params)) {
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
/**
 * Filter empty parameters key.
 * @param  {object} params the parameters object.
 * @return {object}        parameters all keys has value
 */
var filterEmptyParameters = function(params) {
    if (isObject(params)) {
        for (var p in params) {
            if (params.hasOwnProperty(p)) {
                if (!params[p]) {
                    delete params[p];
                }
            }
        }
        return params;
    } else {
        return {};
    }
};
/**
 * Remove Not Required signature parameters.
 */
var filterNotRequiredSignatureParams = function(params) {
    // remove sign method.
    delete params["signMethod"];

    return params;
};

/**
 * Sign request for 1qianbao merchant api request
 * @param  {object} requestParams the request object.
 * @return {string}               the signatured string
 */
var signRequest = function(requestParams) {
    var merchantKey = config.merchantKey;
    // filter empty parameters.
    requestParams = filterEmptyParameters(requestParams);

    // remove not required signature parameters.
    requestParams = filterNotRequiredSignatureParams(requestParams);

    // sort param key asc
    requestParams = sort(requestParams, 'asc');

    var signatureStr = querystring.stringify(requestParams) + merchantKey;

    // default signmethod.
    var signMethod = signMethodMapping[config.signMethod].toLowerCase() || "sha256";

    debug("unsignatured string: %s signMethod:%s", signatureStr, signMethod);

    // signatureStr + merchantKey ==>digest() output signed string.
    return crypto.createHash(signMethod).update(signatureStr).digest("hex");

};

/**
 * Simulator http post form request to access remote server.
 * @param  {string} url     the remote server api url
 * @param  {object} data    the post request data
 * @param  {function} success the success callback
 * @param  {function} failed  the faield callback
 */
var formPost = function(url, data, success, failed) {
    debug("form request data:", data);
    var options = {
        url: url,
        method: "POST",
        form: data,
        strictSSL: false,
        headers: {
            "charset": "utf-8"
        },
        encoding: "utf-8"
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // print result.
            debug("form post result body---->", body);
            if (success) {
                success(querystring.parse(body));
                // success(JSON.parse(body));
            }
        } else {
            failed(error);
        }
    });
};

/**
 * QR code generator
 * @param  {string}   value    the qr code value
 * @param  {string}   filename the save picture url
 * @param  {Function} callback the callback function
 */

function qrEncoder(value, filename, callback) {
    var filePath = "public/images/qr_imgs/%s.png";
    if (config.virtualDir) {
        filePath = config.virtualDir + filePath;
    }
    filename = filename || Date.now();
    filePath = util.format(filePath, filename);

    // find absolute qr code path.
    var absoluteFilePath = path.resolve(process.cwd(), filePath);

    debug("qrEncoder file path: ", absoluteFilePath);

    var qr = require('qr-image');
    var code = qr.image(value, {
        type: 'png' //png, svg, eps and pdf
    });
    var output = fs.createWriteStream(absoluteFilePath);
    code.on('end', function(e) {
        callback(filePath);
    });
    code.on("error", function(err) {
        callback(exception.getErrorModel(err));
    });
    code.pipe(output, {
        end: true
    });
}
var utilities = {
    // return signatured request parameters string.
    signRequest: signRequest,
    // simulator http form post request.
    formPost: function(url, data, success, failed) {
        formPost(url, data, success, failed);
    },
    uuid: function() {
        //Date.now();
        var newDate = new Date;
        return newDate.getTime();
    },
    qrEncoder: qrEncoder
};
module.exports = utilities;
