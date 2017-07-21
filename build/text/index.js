"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./delete"));
__export(require("./insert"));
const functions_1 = require("../functions");
const sorted_set_1 = require("../structures/sorted-set");
class SortedSet {
    constructor() {
        this.elements = [];
    }
    add(value) {
        let index = this.elements.findIndex(({ item }) => {
            return item.equal(value);
        });
        if (-1 === index) {
            index = this.elements.length;
            this.elements.push({ item: value, index });
            this.elements.sort((a, b) => functions_1.compare(a.item, b.item));
        }
        return index;
    }
    index(idx) {
        const item = this.elements.find(({ index }) => index === idx);
        if (item) {
            return item.item;
        }
    }
    reduce(fn, accumulator) {
        return this.elements.reduce((accumulator, { item, index }) => {
            return fn(accumulator, item, index);
        }, accumulator);
    }
}
class Text {
    constructor(order, ordersSet, operationsIndex) {
        this.order = order;
        this.ordersSet = ordersSet || new sorted_set_1.SortedSetArray();
        this.operationsIndex = operationsIndex || [];
        this.index = this.ordersSet.add(order);
        this.operationsIndex[this.index] =
            this.operationsIndex[this.index] || [];
    }
    next() {
        return new Text(this.order.next(), this.ordersSet, this.operationsIndex);
    }
    apply(operation) {
        this.operationsIndex[this.index].push(operation);
    }
    merge(b) {
        const ordersIndexA = this.ordersSet;
        let operationsIndexA = this.operationsIndex.slice(0);
        operationsIndexA = b.operationsIndex.reduce((operationsIndexA, operationsB, orderIndexB) => {
            const orderB = b.ordersSet.index(orderIndexB);
            if (!orderB) {
                return operationsIndexA;
            }
            const index = ordersIndexA.add(orderB);
            operationsIndexA[index] = operationsB;
            return operationsIndexA;
        }, operationsIndexA);
        return new Text(functions_1.merge(this.order, b.order).next(), ordersIndexA, operationsIndexA);
    }
    equal(b) {
        return this.toString() === b.toString();
    }
    reduce(fn, accumulator) {
        return this.ordersSet.reduce((accumulator, order, orderIndex) => {
            return this.operationsIndex[orderIndex].reduce((accumulator, operation, index) => {
                return fn(accumulator, operation, order, index);
            }, accumulator);
        }, accumulator);
    }
    forEach(fn) {
        this.ordersSet.reduce((_, order, orderIndex) => {
            const operations = this.operationsIndex[orderIndex];
            fn({ order, operations });
            return _;
        }, null);
    }
    toString() {
        return this.reduce((accumulator, operation) => {
            return functions_1.applyOperation(operation, accumulator);
        }, []).join('');
    }
}
exports.Text = Text;
//# sourceMappingURL=index.js.map