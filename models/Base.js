var util = require("util");
/**
 * Base model class.
 * @param {} db
 */
var Base = function(db) {
    this.db = db;
};
Base.extend = function(subCtor) {
    util.inherits(subCtor, Base);
    return subCtor;
};

Base.prototype = {
    constructor: Base,
    extend: function(subCtor) {
        util.inherits(subCtor, this.constructor);
        return subCtor;
    },
    setDB: function(db) {
        this.db = db;
    },
    collection: function() {
        if (this._collection) return this._collection;
        return this._collection = this.db.collection('');
    }
};

module.exports = Base;
