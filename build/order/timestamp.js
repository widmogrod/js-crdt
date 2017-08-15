"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timestamp {
    constructor(bucket, time) {
        this.bucket = bucket;
        this.time = time;
        this.bucket = bucket;
        this.time = time;
    }
    next() {
        return new Timestamp(this.bucket, this.time + 1);
    }
    compare(b) {
        if (this.bucket === b.bucket) {
            return this.time - b.time;
        }
        return this.bucket < b.bucket ? -1 : 1;
    }
    merge(b) {
        return this;
    }
    equal(b) {
        return false;
    }
}
exports.Timestamp = Timestamp;
//# sourceMappingURL=timestamp.js.map