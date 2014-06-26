var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
// mongodb.
var mongoose = require('mongoose');

var config = require("./config")();
var route = require("./config/route");
var debug = require('debug')(config.appName);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// assign the swig engine to .html files
app.engine('html', cons.swig);
// set .html as the default extension 
app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// the default is "/" capture the static dir as all static resource root.
app.use("/static", express.static(path.join(__dirname, 'public')));

// debug version.
app.set("env", config.mode);

// first check if mongodb has connect successfully!
var db = mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery');
db.connection.on("error", function(error) {
    debug('Sorry, there is no mongo db server running.');
}).once("open", function callback() {

    // initialize application route config.
    route.init(app);
    // listen http port.
    app.listen(config.port, function() {
        debug(
            'Successfully connected to mongodb://%s:%s %s', config.mongo.host, config.mongo.port,
            ' Express server listening on port ' + config.port
        );
    });

});

// command line $>> npm start
module.exports = app;
