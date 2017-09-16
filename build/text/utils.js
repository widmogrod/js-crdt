"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete_1 = require("./delete");
const insert_1 = require("./insert");
const selection_1 = require("./selection");
function snapshot(text) {
    return text.next();
}
exports.snapshot = snapshot;
function toArray(text) {
    return text.reduce((accumulator, item) => {
        return item.operations.reduce(operationToArray, accumulator);
    }, []);
}
exports.toArray = toArray;
function ensureArrayLength(array, len) {
    if (array.length < len) {
        array.length = len;
    }
    return array;
}
exports.ensureArrayLength = ensureArrayLength;
// TODO make it nicer
function operationToArray(data, op) {
    if (op instanceof insert_1.Insert) {
        let copy = data.slice(0);
        copy = ensureArrayLength(copy, op.at);
        copy.splice(op.at, 0, ...op.value.split(""));
        return copy;
    }
    else if (op instanceof delete_1.Delete) {
        if (op.at < 0) {
            return data;
        }
        let copy = data.slice(0);
        copy = ensureArrayLength(copy, op.at);
        copy.splice(op.at, op.length);
        return copy;
    }
    return data;
}
exports.operationToArray = operationToArray;
function toString(value) {
    return value.join("");
}
exports.toString = toString;
function renderString(text) {
    return toString(toArray(text));
}
exports.renderString = renderString;
function selectionFunc(text, fallback) {
    return text.reduce((accumulator, item) => {
        return item.operations.reduce((selection, op) => {
            console.log({ op });
            if (op instanceof selection_1.Selection) {
                if (op.hasSameOrgin(selection)) {
                    return op;
                }
                return selection;
            }
            if (op instanceof insert_1.Insert) {
                if (op.at <= selection.at) {
                    if (selection.isBetween(op.endsAt)) {
                        return selection
                            .moveRightBy(selection.at - op.at)
                            .expandBy(op.endsAt - selection.at);
                    }
                    else {
                        return selection
                            .moveRightBy(op.length);
                    }
                }
                else if (selection.isBetween(op.at)) {
                    return selection
                        .expandBy(op.length);
                }
                return selection;
            }
            if (op instanceof delete_1.Delete) {
                if (op.at < selection.at) {
                    if (selection.isBetween(op.endsAt)) {
                        return selection
                            .moveRightBy(op.at - selection.at)
                            .expandBy(selection.at - op.endsAt);
                    }
                    else {
                        return selection
                            .moveRightBy(-op.length);
                    }
                }
                else if (selection.isBetween(op.at)) {
                    return selection
                        .expandBy(-op.length);
                }
                return selection;
            }
            return selection;
        }, accumulator);
    }, fallback);
}
exports.selectionFunc = selectionFunc;
//# sourceMappingURL=utils.js.map