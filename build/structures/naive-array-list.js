"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NaiveArrayList {
    constructor(array) {
        this.array = array || [];
    }
    insert(at, item) {
        const clone = this.array.slice(0);
        clone.splice(at, 0, item);
        return new NaiveArrayList(clone);
    }
    remove(at) {
        const clone = this.array.slice(0);
        clone.splice(at, 1);
        return new NaiveArrayList(clone);
    }
    get(at) {
        return this.array[at];
    }
    size() {
        return this.array.length;
    }
    reduce(fn, aggregator) {
        return this.array.reduce(fn, aggregator);
    }
    mempty() {
        return new NaiveArrayList();
    }
    from(position, inclusive = true) {
        const clone = this.array.slice(inclusive ? position : position + 1);
        return new NaiveArrayList(clone);
    }
    to(position, inclusive = true) {
        const clone = this.array.slice(0, inclusive ? position + 1 : position);
        return new NaiveArrayList(clone);
    }
}
exports.NaiveArrayList = NaiveArrayList;
//# sourceMappingURL=naive-array-list.js.map