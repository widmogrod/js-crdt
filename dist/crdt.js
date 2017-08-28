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
function axioms(assert, a, b, c) {
    // commutative   a + c = c + a                i.e: 1 + 2 = 2 + 1
    assert(equal(merge(a, b), merge(b, a)), 'is not commutative');
    // associative   a + (b + c) = (a + b) + c    i.e: 1 + (2 + 3) = (1 + 2) + 3
    assert(equal(merge(a, merge(b, c)), merge(merge(a, b), c)), 'is not associative');
    // idempotent    f(f(a)) = f(a)               i.e: ||a|| = |a|
    assert(equal(merge(a, a), a), 'is not idempotent');
}
exports.axioms = axioms;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Increment {
    constructor(value) {
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
exports.functions = functions;
const increment = require("./increment");
exports.increment = increment;
const utils = require("./utils");
exports.utils = utils;
const order = require("./order/index");
exports.order = order;
const text = require("./text/index");
exports.text = text;

},{"./functions":1,"./increment":2,"./order/index":4,"./text/index":13,"./utils":17}],4:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./vector-clock"));
__export(require("./vector-clock2"));

},{"./vector-clock":5,"./vector-clock2":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class VectorClock {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        vector = utils_1.clone(vector);
        vector[id] = vector[id] || 0;
        this.id = id;
        this.vector = vector;
    }
    next() {
        const vector = utils_1.clone(this.vector);
        ++vector[this.id];
        return new VectorClock(this.id, vector);
    }
    merge(b) {
        const vector = utils_1.union(Object.keys(this.vector), Object.keys(b.vector)).reduce((vector, key) => {
            vector[key] = Math.max(this.vector[key] || 0, b.vector[key] || 0);
            return vector;
        }, {});
        return new VectorClock(this.id, vector);
    }
    equal(b) {
        return this.compare(b) === 0;
    }
    compare(b) {
        const position = utils_1.common(this.vector, b.vector)
            .reduce((result, key) => {
            return result + (this.vector[key] - b.vector[key]);
        }, 0);
        if (position !== 0) {
            return position;
        }
        const difA = utils_1.diff(this.vector, b.vector).length;
        const difB = utils_1.diff(b.vector, this.vector).length;
        const dif = difA - difB;
        if (dif !== 0) {
            return dif;
        }
        const tipPosition = this.vector[this.id] - b.vector[b.id];
        if (tipPosition !== 0) {
            return tipPosition;
        }
        const ha = b.vector.hasOwnProperty(this.id);
        const hb = this.vector.hasOwnProperty(b.id);
        if (!ha && !hb) {
            return this.id < b.id ? -1 : 1;
        }
        else if (ha && !hb) {
            return -1;
        }
        else if (hb && !ha) {
            return 1;
        }
        return 0;
    }
}
exports.VectorClock = VectorClock;

},{"../utils":17}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Id {
    constructor(key, version) {
        this.key = key;
        this.version = version;
        this.key = key;
        this.version = version;
    }
    next() {
        return new Id(this.key, this.version + 1);
    }
    compare(b) {
        return this.key.localeCompare(b.key);
    }
    toString() {
        return `Id(${this.key},${this.version})`;
    }
}
exports.Id = Id;
class VectorClock2 {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        this.id = id;
        let { result, value } = vector.add(id);
        if (result === vector) {
            if (id.version > value.version) {
                result = vector.remove(id).result.add(id).result;
            }
        }
        this.vector = result;
    }
    toString() {
        const a = this.vector.reduce((r, i) => r + i.toString(), '');
        return `VectorClock2(${this.id},${a})`;
    }
    next() {
        return new VectorClock2(this.id.next(), this.vector.remove(this.id).result.add(this.id.next()).result);
    }
    equal(b) {
        return this.compare(b) === 0;
    }
    compare(b) {
        return this.vector
            .intersect(b.vector)
            .reduce((cmp, item) => {
            if (cmp === -1) {
                return cmp;
            }
            const rA = this.vector.add(item);
            const rB = b.vector.add(item);
            cmp = rA.value.version - rB.value.version;
            return cmp;
        }, 0);
    }
    merge(b) {
        const c = this.vector
            .union(b.vector)
            .reduce(({ result, prev }, item) => {
            if (prev) {
                if (prev.key !== item.key) {
                    result = result.add(prev).result;
                }
                else if (prev.version > item.version) {
                    item = prev;
                }
            }
            return { result, prev: item };
        }, {
            result: this.vector.mempty(),
            prev: null,
        });
        return new VectorClock2(this.id, c.result.add(c.prev).result);
    }
}
exports.VectorClock2 = VectorClock2;

},{}],7:[function(require,module,exports){
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
}
exports.NaiveArrayList = NaiveArrayList;

},{}],8:[function(require,module,exports){
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
}
exports.NaiveImmutableMap = NaiveImmutableMap;

},{}],9:[function(require,module,exports){
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
class SetMap {
    constructor(keys, values) {
        this.keys = keys;
        this.values = values;
    }
    set(key, value) {
        const result = this.keys.add(new Indexed(key, this.keys.size()));
        return new SetMap(result.result, this.values.set(result.value.index, value));
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
}
exports.SetMap = SetMap;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function divide(lower, upper, elements, item, onNew, onExists) {
    const step = (upper - lower);
    if (step < 1) {
        return onNew(item, elements, lower);
    }
    const half = step / 2 | 0;
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
class Tuple {
    constructor(result, value) {
        this.result = result;
        this.value = value;
    }
}
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
        return b.reduce((result, item) => {
            return this.has(item) ? result.add(item).result : result;
        }, this.mempty());
    }
    difference(b) {
        return this.reduce((result, item) => {
            return b.has(item) ? result : result.add(item).result;
        }, this.mempty());
    }
    equal(b) {
        if (this.size() != b.size()) {
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
}
exports.SortedSetArray = SortedSetArray;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Delete {
    constructor(at, length) {
        this.at = at;
        this.length = length;
        this.at = at;
        this.length = length;
    }
}
exports.Delete = Delete;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("./text");
const set_map_1 = require("../structures/set-map");
const naive_immutable_map_1 = require("../structures/naive-immutable-map");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const naive_array_list_1 = require("../structures/naive-array-list");
function createFromOrderer(order) {
    return new text_1.Text(order, new set_map_1.SetMap(new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([])), new naive_immutable_map_1.NaiveImmutableMap()));
}
exports.createFromOrderer = createFromOrderer;

},{"../structures/naive-array-list":7,"../structures/naive-immutable-map":8,"../structures/set-map":9,"../structures/sorted-set-array":10,"./text":15}],13:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./insert"));
__export(require("./delete"));
__export(require("./text"));
__export(require("./utils"));
__export(require("./factory"));

},{"./delete":11,"./factory":12,"./insert":14,"./text":15,"./utils":16}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Insert {
    constructor(at, value) {
        this.at = at;
        this.value = value;
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
    }
}
exports.Insert = Insert;

},{}],15:[function(require,module,exports){
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

},{"../functions":1}],16:[function(require,module,exports){
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
// TODO make it nicer
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

},{"../utils":17,"./insert":14}],17:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
function ensureArrayLength(array, len) {
    if (array.length < len) {
        array.length = len;
    }
    return array;
}
exports.ensureArrayLength = ensureArrayLength;
function sortNumbers(a, b) {
    return a - b;
}
exports.sortNumbers = sortNumbers;
function clone(obj) {
    var target = {};
    for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
}
exports.clone = clone;
function keyToMap(r, i) {
    r[i] = true;
    return r;
}
;
function union(a, b) {
    a = a.reduce(keyToMap, {});
    b = b.reduce(keyToMap, a);
    return Object.keys(b);
}
exports.union = union;
function common(a, b) {
    return Object.keys(a).reduce((r, k) => {
        if (b.hasOwnProperty(k)) {
            r.push(k);
        }
        return r;
    }, []).sort();
}
exports.common = common;
function diff(a, b) {
    return Object.keys(a).reduce((r, k) => {
        if (!b.hasOwnProperty(k)) {
            r.push(k);
        }
        return r;
    }, []);
}
exports.diff = diff;

},{}]},{},[3])(3)
});