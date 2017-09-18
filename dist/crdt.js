(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.crdt = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function merge(a, b) {
    return a.merge(b);
}
exports.merge = merge;
function equal(a, b) {
    return a.equal(b);
}
exports.equal = equal;
function compare(a, b) {
    return a.compare(b);
}
exports.compare = compare;
function concat(a, b) {
    return a.concat(b);
}
exports.concat = concat;
function between(value, min, max) {
    if (value <= min) {
        return false;
    }
    else if (value >= max) {
        return false;
    }
    return true;
}
exports.between = between;
function axioms(assert, a, b, c) {
    // commutative   a + c = c + a                i.e: 1 + 2 = 2 + 1
    assert(equal(merge(a, b), merge(b, a)), "is not commutative");
    // associative   a + (b + c) = (a + b) + c    i.e: 1 + (2 + 3) = (1 + 2) + 3
    assert(equal(merge(a, merge(b, c)), merge(merge(a, b), c)), "is not associative");
    // idempotent    f(f(a)) = f(a)               i.e: ||a|| = |a|
    assert(equal(merge(a, a), a), "is not idempotent");
}
exports.axioms = axioms;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Increment {
    constructor(value) {
        this.value = value;
        this.value = value;
    }
    merge(b) {
        return new Increment(Math.max(this.value, b.value));
    }
    equal(b) {
        return this.value === b.value;
    }
    increment() {
        return new Increment(this.value + 1);
    }
}
exports.Increment = Increment;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("./functions");
const increment = require("./increment");
const order = require("./order");
const structures = require("./structures");
const text = require("./text");
exports.default = {
    functions,
    increment,
    order,
    structures,
    text,
};

},{"./functions":1,"./increment":2,"./order":5,"./structures":7,"./text":15}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naive_array_list_1 = require("../structures/naive-array-list");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const vector_clock_1 = require("./vector-clock");
const emptyVector = new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([]));
function createVectorClock(id, version, vector) {
    return new vector_clock_1.VectorClock(new vector_clock_1.Id(id, version ? version : 0), vector ? vector : emptyVector);
}
exports.createVectorClock = createVectorClock;

},{"../structures/naive-array-list":8,"../structures/sorted-set-array":12,"./vector-clock":6}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./vector-clock"));
__export(require("./factory"));

},{"./factory":4,"./vector-clock":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Id {
    constructor(node, version) {
        this.node = node;
        this.version = version;
        this.node = node;
        this.version = version;
    }
    next() {
        return new Id(this.node, this.version + 1);
    }
    compare(b) {
        return this.node.localeCompare(b.node);
    }
    toString() {
        return `Id(${this.node},${this.version})`;
    }
}
exports.Id = Id;
class VectorClock {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        this.id = id;
        /* tslint:disable: prefer-const */
        let { result, value } = vector.add(id);
        if (result === vector) {
            if (id.version > value.version) {
                result = vector.remove(value).result.add(id).result;
            }
        }
        this.vector = result;
    }
    toString() {
        const a = this.vector.reduce((r, i) => r + i.toString(), "");
        return `VectorClock(${this.id},${a})`;
    }
    next() {
        return new VectorClock(this.id.next(), this.vector.remove(this.id).result.add(this.id.next()).result);
    }
    equal(b) {
        if (this.vector.size() !== b.vector.size()) {
            return false;
        }
        return this.vector.reduce((eq, item) => {
            if (eq) {
                const { result, value } = b.vector.add(item);
                if (result === b.vector) {
                    return value.version === item.version;
                }
            }
            return false;
        }, true);
    }
    compare(b) {
        if (this.lessThan(b)) {
            return -1;
        }
        if (b.lessThan(this)) {
            return 1;
        }
        if (this.equal(b)) {
            return 0;
        }
        // then it's councurent
        // right now I don't have such compare option
        // so tie braking approach is to compare ID's
        return this.id.compare(b.id);
    }
    lessThan(b) {
        // VC(a) < VC(b) IF
        //   forall VC(a)[i] <= VC(b)[i]
        //   and exists VC(a)[i] < VC(b)[i]]
        const { everyLEQ, anyLT } = this.vector
            .intersect(b.vector)
            .reduce(({ everyLEQ, anyLT }, item) => {
            const rA = this.vector.add(item).value;
            const rB = b.vector.add(item).value;
            anyLT = anyLT ? anyLT : rA.version < rB.version;
            everyLEQ = everyLEQ ? rA.version <= rB.version : everyLEQ;
            return { everyLEQ, anyLT };
        }, {
            anyLT: false,
            everyLEQ: true,
        });
        return everyLEQ && (anyLT || (this.vector.size() < b.vector.size()));
    }
    merge(b) {
        const vector = this.vector.reduce((vector, item) => {
            const { result, value } = b.vector.add(item);
            if (result === b.vector) {
                if (value.version > item.version) {
                    return vector.add(value).result;
                }
                else {
                    return vector.add(item).result;
                }
            }
            return vector.add(item).result;
        }, this.vector.mempty());
        return new VectorClock(this.id, vector.union(b.vector));
    }
}
exports.VectorClock = VectorClock;

},{}],7:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./naive-array-list"));
__export(require("./naive-immutable-map"));
__export(require("./set-axioms"));
__export(require("./ordered-map"));
__export(require("./sorted-set-array"));

},{"./naive-array-list":8,"./naive-immutable-map":9,"./ordered-map":10,"./set-axioms":11,"./sorted-set-array":12}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NaiveArrayList {
    constructor(array) {
        this.array = array || [];
    }
    insert(at, item) {
        const clone = this.array.slice(0);
        clone.splice(at, 0, item);
        return new NaiveArrayList(clone);
    }
    remove(at) {
        const clone = this.array.slice(0);
        clone.splice(at, 1);
        return new NaiveArrayList(clone);
    }
    get(at) {
        return this.array[at];
    }
    size() {
        return this.array.length;
    }
    reduce(fn, aggregator) {
        return this.array.reduce(fn, aggregator);
    }
    mempty() {
        return new NaiveArrayList();
    }
    from(position, inclusive = true) {
        const clone = this.array.slice(inclusive ? position : position + 1);
        return new NaiveArrayList(clone);
    }
    to(position, inclusive = true) {
        const clone = this.array.slice(0, inclusive ? position + 1 : position);
        return new NaiveArrayList(clone);
    }
}
exports.NaiveArrayList = NaiveArrayList;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NaiveImmutableMap {
    constructor(data) {
        this.data = data;
        this.data = data || {};
    }
    set(key, value) {
        const clone = Object
            .keys(this.data)
            .reduce((clone, k) => {
            clone[k] = this.data[k];
            return clone;
        }, {});
        clone[key] = value;
        return new NaiveImmutableMap(clone);
    }
    get(key) {
        return this.data[key];
    }
    reduce(fn, aggregator) {
        return Object.keys(this.data).reduce((aggregator, key) => {
            return fn(aggregator, this.data[key], key);
        }, aggregator);
    }
}
exports.NaiveImmutableMap = NaiveImmutableMap;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Indexed {
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
    compare(b) {
        return this.value.compare(b.value);
    }
}
exports.Indexed = Indexed;
class OrderedMap {
    constructor(keys, values) {
        this.keys = keys;
        this.values = values;
    }
    set(key, value) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new OrderedMap(result.result, this.values.set(result.value.index, value));
    }
    get(key) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        if (result.result !== this.keys) {
            return null;
        }
        return this.values.get(result.value.index);
    }
    merge(b) {
        return b.reduce((aggregator, item, key) => {
            return aggregator.set(key, item);
        }, this);
    }
    reduce(fn, aggregator) {
        return this.keys.reduce((aggregator, key) => {
            return fn(aggregator, this.values.get(key.index), key.value);
        }, aggregator);
    }
    from(key, inclusive = true) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new OrderedMap(this.keys.from(result.value, inclusive), this.values);
    }
    to(key, inclusive = true) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new OrderedMap(this.keys.to(result.value, inclusive), this.values);
    }
}
exports.OrderedMap = OrderedMap;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function equal(a, b) {
    return a.equal(b);
}
function union(a, b) {
    return a.union(b);
}
function intersect(a, b) {
    return a.intersect(b);
}
function difference(a, b) {
    return a.difference(b);
}
function axioms(assert, a, b, c) {
    assert(equal(union(union(a, b), c), union(a, union(b, c))), "associative union");
    assert(equal(intersect(intersect(a, b), c), intersect(a, intersect(b, c))), "associative intersect");
    assert(equal(union(a, intersect(b, c)), union(intersect(a, b), intersect(a, c))), "union distributes over intersection");
    assert(equal(intersect(a, union(b, c)), intersect(union(a, b), union(a, c))), "intersection distributes over union");
    assert(equal(difference(a, union(b, c)), intersect(difference(a, b), difference(a, c))), "De Morgan's law for union");
    assert(equal(difference(a, intersect(b, c)), union(difference(a, b), difference(a, c))), "De Morgan's law for intersect");
}
exports.axioms = axioms;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function divide(lower, upper, elements, item, onNew, onExists) {
    const step = (upper - lower);
    if (step < 1) {
        return onNew(item, elements, lower);
    }
    const half = Math.trunc(step / 2);
    const idx = lower + half;
    const elm = elements.get(idx);
    const cmp = elm.compare(item);
    if (cmp < 0) {
        return divide(half ? (lower + half) : upper, upper, elements, item, onNew, onExists);
    }
    if (cmp > 0) {
        return divide(lower, half ? (upper - half) : lower, elements, item, onNew, onExists);
    }
    return onExists(elm, elements, idx);
}
exports.divide = divide;
class Tuple {
    constructor(result, value) {
        this.result = result;
        this.value = value;
    }
}
exports.Tuple = Tuple;
class SortedSetArray {
    constructor(elements) {
        this.elements = elements;
    }
    mempty() {
        return new SortedSetArray(this.elements.mempty());
    }
    size() {
        return this.elements.size();
    }
    add(value) {
        return divide(0, this.elements.size(), this.elements, value, (item, elements, lower) => new Tuple(new SortedSetArray(elements.insert(lower, item)), item), (item, elements) => new Tuple(this, item));
    }
    remove(value) {
        return divide(0, this.elements.size(), this.elements, value, (item, elements, lower) => new Tuple(this, value), (item, elements, index) => new Tuple(new SortedSetArray(elements.remove(index)), item));
    }
    has(value) {
        return divide(0, this.elements.size(), this.elements, value, () => false, () => true);
    }
    union(b) {
        return b.reduce((result, item) => {
            return result.add(item).result;
        }, this);
    }
    intersect(b) {
        return this.reduce((result, item) => {
            return b.has(item) ? result.add(item).result : result;
        }, this.mempty());
    }
    difference(b) {
        return this.reduce((result, item) => {
            return b.has(item) ? result : result.add(item).result;
        }, this.mempty());
    }
    equal(b) {
        if (this.size() !== b.size()) {
            return false;
        }
        // TODO reduce is not optimal, because it iterates till the end of set
        return b.reduce((equal, item) => {
            return equal ? this.has(item) : equal;
        }, true);
    }
    reduce(fn, accumulator) {
        return this.elements.reduce(fn, accumulator);
    }
    from(value, inclusive = true) {
        return divide(0, this.elements.size(), this.elements, value, (item, elements, lower) => this.mempty(), (item, elements, index) => new SortedSetArray(this.elements.from(index, inclusive)));
    }
    to(value, inclusive = true) {
        return divide(0, this.elements.size(), this.elements, value, (item, elements, lower) => this.mempty(), (item, elements, index) => new SortedSetArray(this.elements.to(index, inclusive)));
    }
}
exports.SortedSetArray = SortedSetArray;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Delete {
    constructor(at, length) {
        this.at = at;
        this.length = length;
        this.at = at;
        this.length = length;
        this.endsAt = this.at + length;
    }
}
exports.Delete = Delete;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naive_array_list_1 = require("../structures/naive-array-list");
const naive_immutable_map_1 = require("../structures/naive-immutable-map");
const ordered_map_1 = require("../structures/ordered-map");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const text_1 = require("./text");
function createFromOrderer(order) {
    return new text_1.Text(order, new ordered_map_1.OrderedMap(new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([])), new naive_immutable_map_1.NaiveImmutableMap()));
}
exports.createFromOrderer = createFromOrderer;

},{"../structures/naive-array-list":8,"../structures/naive-immutable-map":9,"../structures/ordered-map":10,"../structures/sorted-set-array":12,"./text":18}],15:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./insert"));
__export(require("./delete"));
__export(require("./selection"));
__export(require("./text"));
__export(require("./utils"));
__export(require("./factory"));

},{"./delete":13,"./factory":14,"./insert":16,"./selection":17,"./text":18,"./utils":19}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Insert {
    constructor(at, value) {
        this.at = at;
        this.value = value;
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
        this.length = this.value.length;
        this.endsAt = this.at + this.length;
    }
}
exports.Insert = Insert;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Selection {
    constructor(origin, at, length) {
        this.origin = origin;
        this.at = at;
        this.length = length;
        this.origin = origin;
        this.at = at < 0 ? 0 : at;
        this.length = length < 0 ? 0 : length;
        this.endsAt = this.at + this.length;
    }
    isCursor() {
        return this.length === 0;
    }
    hasSameOrgin(b) {
        return this.origin === b.origin;
    }
    moveRightBy(step) {
        return new Selection(this.origin, this.at + step, this.length);
    }
    expandBy(length) {
        return new Selection(this.origin, this.at, this.length + length);
    }
    isInside(position) {
        return this.at < position && this.endsAt > position;
    }
}
exports.Selection = Selection;

},{}],18:[function(require,module,exports){
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
    apply(...ops) {
        let operations = this.map.get(this.order);
        if (!operations) {
            operations = [];
        }
        ops.forEach((op) => operations.push(op));
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

},{"../functions":1}],19:[function(require,module,exports){
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
        // Don't move cursor when insert is done at the same position
        if (selection.isCursor() && op.at === selection.at) {
            return selection;
        }
        // is after selection:
        //       sssss
        //           iii
        //             iiiiii
        if (op.at >= selection.endsAt) {
            return selection;
        }
        // is before selection or on the same position:
        //       sssss
        //       iii
        // iiii
        //  iiiiii
        if (op.at <= selection.at) {
            return selection.moveRightBy(op.length);
        }
        // is inside selection:
        //       sssss
        //        i
        //           iiii
        return selection.expandBy(op.length);
    }
    if (op instanceof delete_1.Delete) {
        // is before selection:
        //       ssssss
        //  ddd
        if (op.endsAt < selection.at) {
            return selection.moveRightBy(-op.length);
        }
        // is after selection:
        //       ssssss
        //               ddddd
        if (op.at > selection.endsAt) {
            return selection;
        }
        // starts inside selection block:
        //       ssssss
        //       dddddddddd
        //       ddd
        //         ddd
        //         ddddddddd
        if (op.at >= selection.at) {
            return selection.expandBy(-Math.min(selection.endsAt - op.at, op.length));
        }
        // ends inside selection:
        //       ssssss
        //     dddd
        //   dddddddd
        return selection.expandBy(selection.at - op.endsAt).moveRightBy(op.at - selection.at);
    }
    return selection;
}
exports.selectionUpdate = selectionUpdate;

},{"../structures/naive-immutable-map":9,"./delete":13,"./insert":16,"./selection":17}]},{},[3])(3)
});