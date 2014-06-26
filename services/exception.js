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
    }
}
