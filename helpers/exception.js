/**
 * uniform exception handler
 * @type {Object}
 */
module.exports = {
    /**
     * generated the uniform error model
     * @param  {object} err the error from any operator from server.
     * @return {object}     error model
     */
    getErrorModel: function(err) {
        var _error = {
            status: err.status || 500,
            message: err.message || ''
        };
        return {
            failed: true,
            error: _error
        };
    },
    /**
     * Exposed uniform api json response data result structure
     * @param  {object} res   response
     * @param  {object} error error object
     * @return {json}         output json result to client.
     */
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
