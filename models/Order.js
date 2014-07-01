var Base = require("./Base");
module.exports = new Base().extend({
    orderId: null,
    totalAmount: null,
    createDate: Date.now(),
    products: []
});
