"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Timestamp = (function () {
    function Timestamp(bucket, time) {
        this.bucket = bucket;
        this.time = time;
    }
    Timestamp.prototype.next = function () {
        return new Timestamp(this.bucket, this.time + 1);
    };
    Timestamp.prototype.compare = function (b) {
        if (this.bucket === b.bucket) {
            return this.time - b.time;
        }
        return this.bucket < b.bucket ? -1 : 1;
    };
    Timestamp.prototype.merge = function (b) {
        return this;
    };
    Timestamp.prototype.equal = function (b) {
        return false;
    };
    return Timestamp;
}());
exports.Timestamp = Timestamp;
//# sourceMappingURL=timestamp.js.map