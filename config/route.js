var products = require('../controllers/products');
var routes = require('../controllers/index');
var users = require('../controllers/users');
var apis = require('../controllers/apis');

var _app = null;
/// error handlers
var errorHandler404 = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};
var errorHandler500 = function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        // production error handler, development will print stacktrace
        error: _app.get('env') !== 'production' ? err : {}
    });
};

module.exports = {
    init: function(app) {
        _app = app;

        // route request for all /product/* into our productController.
        app.use('/product', products);

        // for all restfull /api/* router, first validate apis security.
        app.use('/api', apis);

        // only requests to /users/* will be sent to our "router"
        app.use('/users', users);

        app.use('/', routes);

        /// catch 404 and forward to error handler
        app.use(errorHandler404);

        // catch 500 and other error and stop app exec.
        app.use(errorHandler500);
    }
}
