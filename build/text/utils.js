"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function snapshot(text) {
    return text.next();
}
exports.snapshot = snapshot;
function toArray(text) {
    return text.reduce((accumulator, operations) => {
        return operations.reduce((accumulator, operation) => {
            return operation.apply(accumulator);
        }, accumulator);
    }, []);
}
exports.toArray = toArray;
function toString(value) {
    return value.join('');
}
exports.toString = toString;
function renderString(text) {
    return toString(toArray(text));
}
exports.renderString = renderString;
//# sourceMappingURL=utils.js.map