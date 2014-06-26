var Base = require("./Base");
module.exports = new Base().extend({
    name: null,
    pictureUrl: null,
    description: null,
    unitPrice: 0,
    status: 1,
    date: Date.now()
});
