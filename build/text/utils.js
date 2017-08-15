"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insert_1 = require("./insert");
function snapshot(text) {
    return text.next();
}
exports.snapshot = snapshot;
function toArray(text) {
    return text.reduce((accumulator, operations) => {
        return operations.reduce(operationToArray, accumulator);
    }, []);
}
exports.toArray = toArray;
const utils_1 = require("../utils");
function operationToArray(data, op) {
    if (op instanceof insert_1.Insert) {
        let copy = data.slice(0);
        copy = utils_1.ensureArrayLength(copy, op.at);
        copy.splice(op.at, 0, ...op.value.split(''));
        return copy;
    }
    else {
        if (op.at < 0)
            return data;
        let copy = data.slice(0);
        copy = utils_1.ensureArrayLength(copy, op.at);
        copy.splice(op.at, op.length);
        return copy;
    }
}
exports.operationToArray = operationToArray;
function toString(value) {
    return value.join('');
}
exports.toString = toString;
function renderString(text) {
    return toString(toArray(text));
}
exports.renderString = renderString;
//# sourceMappingURL=utils.js.map