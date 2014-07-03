var Base = require("./Base");
module.exports = new Base().extend(function Order() {
    this.orderId = null;
    this.totalAmount = null;
    this.createDate = Date.now();
    this.status = 'initialize'; // initialize, paid,deliveried, completed,
    this.products = [];
});
