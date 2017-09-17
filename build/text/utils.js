"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete_1 = require("./delete");
const insert_1 = require("./insert");
const selection_1 = require("./selection");
const naive_immutable_map_1 = require("../structures/naive-immutable-map");
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
function getSelection(text, fallback) {
    return text.reduce((s, oo) => {
        return oo.operations.reduce(selectionUpdate, s);
    }, fallback);
}
exports.getSelection = getSelection;
function getSelections(text, fallback) {
    return text.reduce((map, oo) => {
        return oo.operations.reduce((map, o) => {
            return map.reduce((map, s, key) => {
                if (o instanceof selection_1.Selection) {
                    if (!map.get(o.origin)) {
                        return map.set(o.origin, o);
                    }
                }
                const next = selectionUpdate(s, o);
                return map.set(next.origin, next);
            }, map);
        }, map);
    }, new naive_immutable_map_1.NaiveImmutableMap().set(fallback.origin, fallback));
}
exports.getSelections = getSelections;
function selectionUpdate(selection, op) {
    if (op instanceof selection_1.Selection) {
        if (op.hasSameOrgin(selection)) {
            return op;
        }
        return selection;
    }
    if (op instanceof insert_1.Insert) {
        if (op.at < selection.at) {
            return selection.moveRightBy(op.length);
        }
        else if (op.at === selection.at) {
            return selection.isCursor()
                ? selection
                : selection.moveRightBy(op.length);
        }
        else if (selection.isInside(op.at)) {
            return selection.expandBy(op.length);
        }
        return selection;
    }
    if (op instanceof delete_1.Delete) {
        if (op.at < selection.at) {
            if (selection.isInside(op.endsAt)) {
                return selection
                    .moveRightBy(op.at - selection.at)
                    .expandBy(selection.at - op.endsAt);
            }
            else {
                return selection
                    .moveRightBy(-op.length);
            }
        }
        else if (op.at === selection.at) {
            if (selection.isInside(op.endsAt)) {
                return selection
                    .moveRightBy(op.at - selection.at)
                    .expandBy(selection.at - op.endsAt);
            }
            else {
                return selection;
            }
        }
        else if (selection.isInside(op.at)) {
            return selection
                .expandBy(-op.length);
        }
        return selection;
    }
    return selection;
}
exports.selectionUpdate = selectionUpdate;
//# sourceMappingURL=utils.js.map