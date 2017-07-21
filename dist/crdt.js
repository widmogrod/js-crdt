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

},{"./functions":1,"./increment":2,"./order/index":5,"./text/index":9,"./utils":11}],4:[function(require,module,exports){
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

},{"../utils":11}],5:[function(require,module,exports){
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
class Leaf {
    constructor(value) {
        this.value = value;
    }
    get leaf() {
        return this;
    }
    get left() {
        return null;
    }
    get right() {
        return null;
    }
    find(fn) {
        if (fn(this.value)) {
            return this.value;
        }
    }
    add(item) {
        const cmp = this.value.compare(item);
        if (cmp === 0) {
            return this;
        }
        else if (cmp < 0) {
            return new Branch(new Leaf(item), this);
        }
        else if (cmp > 0) {
            return new Branch(this, null, new Leaf(item));
        }
    }
    reduce(fn, base) {
        return fn(base, this);
    }
}
class Branch {
    constructor(leaf, left, right) {
        this.leaf = leaf;
        this.left = left;
        this.right = right;
    }
    find(fn) {
        if (fn(this.leaf.value)) {
            return this.leaf.value;
        }
        if (this.left) {
            const fl = this.left.find(fn);
            if (fl)
                return fl;
        }
        if (this.right) {
            const fr = this.right.find(fn);
            if (fr)
                return fr;
        }
    }
    add(item) {
        const cmp = this.leaf.value.compare(item);
        if (cmp === 0) {
            return this;
        }
        else if (cmp < 0) {
            if (this.right) {
                return this.left
                    ? new Branch(this.leaf, this.left.add(item), this.right)
                    : new Branch(this.leaf, new Leaf(item), this.right);
            }
            else {
                return this.left
                    ? new Branch(new Leaf(item), this.left.left, this.leaf)
                    : new Branch(new Leaf(item), this.leaf, null);
            }
        }
        else if (cmp > 0) {
            if (this.left) {
                return this.right
                    ? new Branch(this.leaf, this.left, this.right.add(item))
                    : new Branch(this.leaf, this.left, new Leaf(item));
            }
            else {
                return this.right
                    ? new Branch(new Leaf(item), this.leaf, this.right.right)
                    : new Branch(new Leaf(item), null, this.leaf);
            }
        }
    }
    reduce(fn, base) {
        base = fn(base, this.leaf);
        if (this.left) {
            base = this.left.reduce(fn, base);
        }
        if (this.right) {
            base = this.right.reduce(fn, base);
        }
        return base;
    }
}
function increment(value) {
    return value + 1;
}
class Indexed {
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
    compare(b) {
        return this.value.compare(b.value);
    }
}
class SortedSetFast {
    constructor() {
        this.count = 0;
    }
    get length() {
        return this.reduce(increment, 0);
    }
    add(value) {
        const val = new Indexed(value, this.count);
        if (!this.elements) {
            this.elements = new Leaf(val);
        }
        else {
            this.elements = this.elements.add(val);
            if (this.length > this.count) {
                this.count++;
            }
        }
        val.index = this.count;
        return this.count;
    }
    index(idx) {
        return this.elements
            ? this.elements.find(({ index }) => index === idx).value
            : null;
    }
    reduce(fn, accumulator) {
        if (!this.elements) {
            return accumulator;
        }
        return this.elements.reduce((accumulator, item) => {
            return fn(accumulator, item.value, item.value.index);
        }, accumulator);
    }
}
exports.SortedSetFast = SortedSetFast;
class SortedSetArray {
    constructor() {
        this.elements = [];
    }
    add(value) {
        const val = new Indexed(value, this.elements.length);
        function divide(lower, upper, elements, item) {
            const step = (upper - lower);
            if (step < 1) {
                elements.splice(lower, 0, item);
                return item.index;
            }
            const half = step / 2 | 0;
            const idx = lower + step;
            const elm = elements[idx];
            const cmp = elm.compare(val);
            if (cmp < 0) {
                return divide(idx, upper, elements, item);
            }
            if (cmp > 0) {
                return divide(lower, idx, elements, item);
            }
            if (cmp === 0) {
                return elm.index;
            }
        }
        return divide(0, this.elements.length - 1, this.elements, val);
    }
    index(idx) {
        const r = this.elements.find(({ index }) => index === idx);
        return r ? r.value : null;
    }
    reduce(fn, accumulator) {
        return this.elements.reduce((accumulator, item) => {
            return fn(accumulator, item.value, item.index);
        }, accumulator);
    }
}
exports.SortedSetArray = SortedSetArray;

},{}],8:[function(require,module,exports){
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

},{"../utils":11}],9:[function(require,module,exports){
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

},{"../functions":1,"../structures/sorted-set":7,"./delete":8,"./insert":10}],10:[function(require,module,exports){
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

},{"../utils":11}],11:[function(require,module,exports){
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