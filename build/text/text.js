"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions");
const set_map_1 = require("../structures/set-map");
const naive_immutable_map_1 = require("../structures/naive-immutable-map");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const naive_array_list_1 = require("../structures/naive-array-list");
class Text {
    constructor(order, setMap) {
        this.order = order;
        this.setMap = setMap;
        this.setMap = setMap || new set_map_1.SetMap(new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([])), new naive_immutable_map_1.NaiveImmutableMap());
    }
    next() {
        return new Text(this.order.next(), this.setMap);
    }
    apply(operation) {
        let value = this.setMap.get(this.order);
        if (!value) {
            value = [];
        }
        value.push(operation);
        this.setMap = this.setMap.set(this.order, value);
    }
    merge(b) {
        return new Text(functions_1.merge(this.order, b.order), this.setMap.merge(b.setMap));
    }
    equal(b) {
        return functions_1.equal(this.order, b.order);
    }
    reduce(fn, accumulator) {
        return this.setMap.reduce((accumulator, operations, order) => {
            return operations.reduce((accumulator, operation) => {
                return fn(accumulator, operation, order);
            }, accumulator);
        }, accumulator);
    }
    forEach(fn) {
        return this.setMap.reduce((_, operations, order) => {
            fn({ order, operations });
            return _;
        }, null);
    }
}
exports.Text = Text;
//# sourceMappingURL=text.js.map