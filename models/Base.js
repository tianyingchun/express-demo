function inherit(subclass, supperclass) {
    var F = function() {};
    F.prototype = supperclass.prototype;
    subclass.prototype = new F();
    subclass.prototype.supper = supperclass.prototype;
    subclass.prototpe.constructor = subclass;
    if (supperclass.prototype.constructor == Object.prototype.constructor) {
        supperclass.prototype.constructor = supperclass;
    }
    return subclass;

}

function setPrototype(ctor, properties) {
    ctor.prototype = properties || {};
    ctor.prototype.constructor = ctor;
    return ctor;
};

/**
 * Base model class.
 * @param {} db 
 */
var Base = function(db) {
    this.db = db;
};

Base.prototype = {
    constructor: Base,
    extend: function(properties) {
        var child = setPrototype(function() {}, properties);
        return inherit(child, this.constructor);
    },
    setDB: function(db) {
        this.db = db;
    },
    collection: function() {
        if (this._collection) return this._collection;
        return this._collection = this.db.collection('');
    }
}

module.exports = Base;
