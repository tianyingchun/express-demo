var Base = require("./Base");
module.exports = new Base().extend(function Product() {
    this.name = null;
    this.pictureUrl = null;
    this.description = null;
    this.unitPrice = 0;
    this.status = 1;
    this.date = Date.now();
});
