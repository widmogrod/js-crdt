"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions");
class Text {
    constructor(order, setMap) {
        this.order = order;
        this.setMap = setMap;
    }
    next() {
        return new Text(this.order.next(), this.setMap);
    }
    apply(operation) {
        let operations = this.setMap.get(this.order);
        if (!operations) {
            operations = [];
        }
        operations.push(operation);
        this.setMap = this.setMap.set(this.order, operations);
        return {
            operations,
            order: this.order,
        };
    }
    merge(b) {
        return new Text(functions_1.merge(this.order, b.order), functions_1.merge(this.setMap, b.setMap));
    }
    equal(b) {
        return functions_1.equal(this.order, b.order);
    }
    reduce(fn, accumulator) {
        return this.setMap.reduce((accumulator, operations, order) => {
            return fn(accumulator, { operations, order });
        }, accumulator);
    }
}
exports.Text = Text;
//# sourceMappingURL=text.js.map