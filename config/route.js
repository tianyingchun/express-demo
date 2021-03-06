var products = require('../controllers/products');
var routes = require('../controllers/index');
var users = require('../controllers/users');
var apis = require('../controllers/apis');
var orders = require("../controllers/orders");
var exception = require("../helpers/exception");

var _app = null;
/// error handlers
var errorHandler404 = function(req, res, next) {
    var err = new Error('404 Not Found!');
    err.status = 404;
    next(err);
};
var errorHandler500 = function(err, req, res, next) {
    res.status(err.status || 500);
    var contentType = res.get('Content-Type');
    switch (contentType) {
        case "application/json":
            exception.writeJSONError(res, err);
            break;
        default:
            res.render('error', {
                message: err.message,
                // production error handler, development will print stacktrace
                error: _app.get('env') !== 'production' ? err : {}
            });
            break;
    }
};

module.exports = {
    init: function(app) {
        _app = app;

        // route request for all /product/* into our productController.
        _app.use('/product', products);

        // route request for all /order/* into our ordercontroller.
        _app.use('/order', orders);

        // for all restfull /api/* router, first validate apis security.
        _app.use('/api', apis);

        // only requests to /users/* will be sent to our "router"
        _app.use('/users', users);

        _app.use('/', routes);

        /// catch 404 and forward to error handler
        _app.use(errorHandler404);

        // catch 500 and other error and stop app exec.
        _app.use(errorHandler500);
    }
}
