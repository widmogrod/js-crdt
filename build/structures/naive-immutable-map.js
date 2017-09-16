"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NaiveImmutableMap {
    constructor(data) {
        this.data = data;
        this.data = data || {};
    }
    set(key, value) {
        const clone = Object
            .keys(this.data)
            .reduce((clone, k) => {
            clone[k] = this.data[k];
            return clone;
        }, {});
        clone[key] = value;
        return new NaiveImmutableMap(clone);
    }
    get(key) {
        return this.data[key];
    }
    reduce(fn, aggregator) {
        return Object.keys(this.data).reduce((aggregator, key) => {
            return fn(aggregator, this.data[key], key);
        }, aggregator);
    }
}
exports.NaiveImmutableMap = NaiveImmutableMap;
//# sourceMappingURL=naive-immutable-map.js.map