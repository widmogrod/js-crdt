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
            return fn(accumulator, operations, order);
        }, accumulator);
    }
}
exports.Text = Text;
//# sourceMappingURL=text.js.map