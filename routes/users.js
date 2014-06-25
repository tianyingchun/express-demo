var express = require('express');
var router = express.Router();
var debug = require('debug')('express-demo');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});



// match /user/:id 
router.get('/:id', function(req, res) {
    var userId = req.params.id;
    debug("userid:%s", userId);
    res.send('respond by users/id=' + userId);
});

module.exports = router;
