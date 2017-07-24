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
function applyOperation(operation, data) {
    return operation.apply(data);
}
exports.applyOperation = applyOperation;
function axioms(assert, a, b, c) {
    // commutative   a + c = c + a                i.e: 1 + 2 = 2 + 1
    let x = a.merge(b);
    // let x:CRDT<T> = a.merge(b)
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./functions"));
__export(require("./increment"));
__export(require("./utils"));
__export(require("./order/index"));
__export(require("./text/index"));

},{"./functions":1,"./increment":2,"./order/index":5,"./text/index":11,"./utils":14}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Discrete {
    constructor(id, vector) {
        vector = utils_1.clone(vector);
        vector[id] = vector[id] || 0;
        this.id = id;
        this.vector = vector;
    }
    next() {
        const vector = utils_1.clone(this.vector);
        ++vector[this.id];
        return new Discrete(this.id, vector);
    }
    merge(b) {
        const vector = utils_1.union(Object.keys(this.vector), Object.keys(b.vector)).reduce((vector, key) => {
            vector[key] = Math.max(this.vector[key] || 0, b.vector[key] || 0);
            return vector;
        }, {});
        return new Discrete(this.id, vector);
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
exports.Discrete = Discrete;

},{"../utils":14}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./discrete"));
__export(require("./timestamp"));
__export(require("./discrete"));
__export(require("./timestamp"));

},{"./discrete":4,"./timestamp":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timestamp {
    constructor(bucket, time) {
        this.bucket = bucket;
        this.time = time;
    }
    next() {
        return new Timestamp(this.bucket, this.time + 1);
    }
    compare(b) {
        if (this.bucket === b.bucket) {
            return this.time - b.time;
        }
        return this.bucket < b.bucket ? -1 : 1;
    }
    merge(b) {
        return this;
    }
    equal(b) {
        return false;
    }
}
exports.Timestamp = Timestamp;

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
    get(at) {
        return this.array[at];
    }
    size() {
        return this.array.length;
    }
    reduce(fn, aggregator) {
        return this.array.reduce(fn, aggregator);
    }
}
exports.NaiveArrayList = NaiveArrayList;

},{}],8:[function(require,module,exports){
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
        if (result.result === this.keys) {
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

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function divide(lower, upper, elements, item, onNew, onExists) {
    const step = (upper - lower);
    if (step < 1) {
        return onNew(item, elements, lower);
    }
    const half = step / 2 | 0;
    const idx = lower + step;
    const elm = elements.get(idx);
    const cmp = elm.compare(item);
    if (cmp < 0) {
        return divide(idx, upper, elements, item, onNew, onExists);
    }
    if (cmp > 0) {
        return divide(lower, idx, elements, item, onNew, onExists);
    }
    return onExists(elm, elements);
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
    size() {
        return this.elements.size();
    }
    add(value) {
        return divide(0, this.elements.size() - 1, this.elements, value, (value, elements, lower) => new Tuple(new SortedSetArray(elements.insert(lower, value)), value), (value, elements) => new Tuple(this, value));
    }
    has(value) {
        return divide(0, this.elements.size() - 1, this.elements, value, () => false, () => true);
    }
    union(b) {
        return b.reduce((result, item) => {
            return result.add(item).result;
        }, this);
    }
    reduce(fn, accumulator) {
        return this.elements.reduce(fn, accumulator);
    }
}
exports.SortedSetArray = SortedSetArray;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Delete {
    constructor(at, length) {
        this.at = at;
        this.length = length;
    }
    apply(data) {
        if (this.at < 0)
            return data;
        let copy = data.slice(0);
        copy = utils_1.ensureArrayLength(copy, this.at);
        copy.splice(this.at, this.length);
        return copy;
    }
}
exports.Delete = Delete;

},{"../utils":14}],11:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./insert"));
__export(require("./delete"));
__export(require("./text"));

},{"./delete":10,"./insert":12,"./text":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Insert {
    constructor(at, value) {
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
    }
    apply(data) {
        let copy = data.slice(0);
        copy = utils_1.ensureArrayLength(copy, this.at);
        copy.splice(this.at, 0, ...this.value.split(''));
        return copy;
    }
}
exports.Insert = Insert;

},{"../utils":14}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions");
const set_map_1 = require("../structures/set-map");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const naive_array_list_1 = require("../structures/naive-array-list");
class Text {
    constructor(order, setMap) {
        this.order = order;
        this.setMap = setMap;
        this.setMap = setMap || new set_map_1.SetMap(new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([])), new Map());
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
        return new Text(functions_1.merge(this.order, b.order).next(), this.setMap.merge(b.setMap));
    }
    equal(b) {
        return functions_1.equal(this.order, b.order);
    }
    reduce(fn, accumulator) {
        return this.setMap.reduce((accumulator, operations, order) => {
            return operations.reduce((accumulator, operation) => {
                return fn(accumulator, operation, order);
            }, accumulator);
        }, accumulator);
    }
    forEach(fn) {
        return this.setMap.reduce((_, operations, order) => {
            fn({ order, operations });
            return _;
        }, null);
    }
}
exports.Text = Text;

},{"../functions":1,"../structures/naive-array-list":7,"../structures/set-map":8,"../structures/sorted-set-array":9}],14:[function(require,module,exports){
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