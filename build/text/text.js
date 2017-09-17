"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions");
class Text {
    constructor(order, map) {
        this.order = order;
        this.map = map;
    }
    next() {
        return new Text(this.order.next(), this.map);
    }
    apply(operation) {
        let operations = this.map.get(this.order);
        if (!operations) {
            operations = [];
        }
        operations.push(operation);
        this.map = this.map.set(this.order, operations);
        return {
            operations,
            order: this.order,
        };
    }
    mergeOperations(o) {
        return new Text(functions_1.merge(this.order, o.order), this.map.set(o.order, o.operations));
    }
    merge(b) {
        return new Text(functions_1.merge(this.order, b.order), functions_1.merge(this.map, b.map));
    }
    equal(b) {
        return functions_1.equal(this.order, b.order);
    }
    reduce(fn, accumulator) {
        return this.map.reduce((accumulator, operations, order) => {
            return fn(accumulator, { operations, order });
        }, accumulator);
    }
    from(version, inclusive = true) {
        return this
            .map.from(version, inclusive)
            .reduce((accumulator, operations, order) => {
            accumulator.push({ operations, order });
            return accumulator;
        }, []);
    }
    to(version, inclusive = true) {
        return this
            .map.to(version, inclusive)
            .reduce((accumulator, operations, order) => {
            accumulator.push({ operations, order });
            return accumulator;
        }, []);
    }
}
exports.Text = Text;
//# sourceMappingURL=text.js.map