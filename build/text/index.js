"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./delete"));
__export(require("./insert"));
var functions_1 = require("../functions");
// type Operation = Insert | Delete
// type OrdersIndex = Array<Operation>
// type OperationsIndex<T> = Array<Orderer<Text<T>>
var Text = (function () {
    function Text(order, ordersIndex, operationsIndex) {
        this.order = order;
        this.ordersIndex = ordersIndex || [];
        this.operationsIndex = operationsIndex || [];
        this.index = this.ordersIndex.findIndex(function (o) { return o.equal(order); });
        if (-1 === this.index) {
            this.index = this.ordersIndex.push(order) - 1;
        }
        this.operationsIndex[this.index] =
            this.operationsIndex[this.index] || [];
    }
    Text.prototype.apply = function (operation) {
        this.operationsIndex[this.index].push(operation);
    };
    Text.prototype.merge = function (b) {
        var ordersIndexA = this.ordersIndex.slice(0);
        var operationsIndexA = this.operationsIndex.slice(0);
        operationsIndexA = b.operationsIndex.reduce(function (operationsIndexA, operationsB, orderIndexB) {
            var orderB = b.ordersIndex[orderIndexB];
            var notFoundInA = -1 === ordersIndexA.findIndex(function (orderA) { return orderA.equal(orderB); });
            if (notFoundInA) {
                var index = ordersIndexA.push(orderB) - 1;
                operationsIndexA[index] = operationsB;
            }
            return operationsIndexA;
        }, operationsIndexA);
        return new Text(functions_1.merge(this.order, b.order).next(), ordersIndexA, operationsIndexA);
    };
    Text.prototype.equal = function (b) {
        return this.toString() === b.toString();
    };
    Text.prototype.reduce = function (fn, accumulator) {
        var _this = this;
        return this.ordersIndex.slice(0).sort(functions_1.compare).reduce(function (accumulator, order) {
            var orderIndex = _this.ordersIndex.findIndex(function (o) { return o.equal(order); });
            return _this.operationsIndex[orderIndex].reduce(function (accumulator, operation, index) {
                return fn(accumulator, operation, order, index);
            }, accumulator);
        }, accumulator);
    };
    Text.prototype.toString = function () {
        return this.reduce(function (accumulator, operation) {
            return functions_1.applyOperation(operation, accumulator);
        }, []).join('');
    };
    return Text;
}());
exports.Text = Text;
//# sourceMappingURL=index.js.map