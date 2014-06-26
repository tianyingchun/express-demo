function inherit(subclass, supperclass) {
    var F = function noop() {};
    F.prototype = supperclass.prototype;
    subclass.prototype = new F();
    subclass.prototype.supper = supperclass.prototype;
    subclass.prototype.constructor = subclass;
    if (supperclass.prototype.constructor == Object.prototype.constructor) {
        supperclass.prototype.constructor = supperclass;
    }
    return subclass;

}

function setPrototype(ctor, properties) {
    for (var i in properties) {
        if (properties.hasOwnProperty(i)) {
            ctor.prototype[i] = properties[i];
        }
    }
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
        var child = function child() {};
        var child = inherit(child, this.constructor);
        return setPrototype(child, properties);
    },
    setDB: function(db) {
        this.db = db;
    },
    collection: function() {
        if (this._collection) return this._collection;
        return this._collection = this.db.collection('');
    }
}
