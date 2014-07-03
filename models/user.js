/**
 * User model
 */
var BaseModel = require("./Base");

module.exports = new BaseModel().extend(function User() {
    this.getName = function() {
        return this.name;
    };
    this.setName = function(name) {
        this.name = name;
    };
});
