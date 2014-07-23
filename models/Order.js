var Base = require("./Base");
module.exports = new Base().extend(function Order() {
    this.orderId = null;
    this.orderTraceNo = '';
    this.totalAmount = null;
    this.createDate = Date.now();
    this.status = 'initialize'; // initialize, paid, unpaid, failed, deliveried, completed,
    this.products = [];
});
