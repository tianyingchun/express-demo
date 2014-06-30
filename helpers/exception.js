/**
 * uniform exception handler
 * @type {Object}
 */
module.exports = {
    getErrorModel: function(err) {
        return {
            failed: true,
            error: err
        };
    },
    writeJSONError: function(res, error) {
        var status = error.status || 500;
        var message = error.message || "The request internal exception!";
        res.json(status, {
            retCode: status,
            info: null,
            message: message
        });
    }
}
