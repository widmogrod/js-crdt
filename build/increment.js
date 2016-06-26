"use strict";
var Increment = (function () {
    function Increment(value) {
        this.value = value;
    }
    Increment.prototype.merge = function (b) {
        return new Increment(Math.max(this.value, b.value));
    };
    Increment.prototype.equal = function (b) {
        return this.value === b.value;
    };
    Increment.prototype.increment = function () {
        return new Increment(this.value + 1);
    };
    return Increment;
}());
exports.Increment = Increment;
//# sourceMappingURL=increment.js.map