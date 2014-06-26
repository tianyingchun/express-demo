/**
 * User model
 */
var BaseModel = require("./Base");

module.exports = new BaseModel().extend({
    getName: function() {
        return this.name;
    },
    setName: function(name) {
        this.name = name;
    }
});
