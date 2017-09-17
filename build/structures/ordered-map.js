"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Indexed {
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
    compare(b) {
        return this.value.compare(b.value);
    }
}
exports.Indexed = Indexed;
class OrderedMap {
    constructor(keys, values) {
        this.keys = keys;
        this.values = values;
    }
    set(key, value) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new OrderedMap(result.result, this.values.set(result.value.index, value));
    }
    get(key) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        if (result.result !== this.keys) {
            return null;
        }
        return this.values.get(result.value.index);
    }
    merge(b) {
        return b.reduce((aggregator, item, key) => {
            return aggregator.set(key, item);
        }, this);
    }
    reduce(fn, aggregator) {
        return this.keys.reduce((aggregator, key) => {
            return fn(aggregator, this.values.get(key.index), key.value);
        }, aggregator);
    }
    from(key, inclusive = true) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new OrderedMap(this.keys.from(result.value, inclusive), this.values);
    }
    to(key, inclusive = true) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new OrderedMap(this.keys.to(result.value, inclusive), this.values);
    }
}
exports.OrderedMap = OrderedMap;
//# sourceMappingURL=ordered-map.js.map