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
    var x = a.merge(b);
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
var Increment = (function () {
    function Increment(value) {
        this.value = value;
    }
    Increment.prototype.merge = function (b) {
        return new Increment(Math.max(this.value, b.value));
    };
    Increment.prototype.equal = function (b) {
        return this.value === b.value;
    };
    Increment.prototype.increment = function () {
        return new Increment(this.value + 1);
    };
    return Increment;
}());
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

},{"./functions":1,"./increment":2,"./order/index":5,"./text/index":8,"./utils":10}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Discrete = (function () {
    function Discrete(id, vector) {
        vector = utils_1.clone(vector);
        vector[id] = vector[id] || 0;
        this.id = id;
        this.vector = vector;
    }
    Discrete.prototype.next = function () {
        var vector = utils_1.clone(this.vector);
        ++vector[this.id];
        return new Discrete(this.id, vector);
    };
    Discrete.prototype.merge = function (b) {
        var _this = this;
        var vector = utils_1.union(Object.keys(this.vector), Object.keys(b.vector)).reduce(function (vector, key) {
            vector[key] = Math.max(_this.vector[key] || 0, b.vector[key] || 0);
            return vector;
        }, {});
        return new Discrete(this.id, vector);
    };
    Discrete.prototype.equal = function (b) {
        return this.compare(b) === 0;
    };
    Discrete.prototype.compare = function (b) {
        var _this = this;
        var position = utils_1.common(this.vector, b.vector)
            .reduce(function (result, key) {
            return result + (_this.vector[key] - b.vector[key]);
        }, 0);
        if (position === 0) {
            var tipPosition = this.vector[this.id] - b.vector[b.id];
            if (tipPosition !== 0) {
                return tipPosition;
            }
            var ha = b.vector.hasOwnProperty(this.id);
            var hb = this.vector.hasOwnProperty(b.id);
            if (!ha && !hb) {
                return this.id < b.id ? -1 : 1;
            }
            else if (ha && !hb) {
                return -1;
            }
            else if (hb && !ha) {
                return 1;
            }
        }
        return position;
    };
    return Discrete;
}());
exports.Discrete = Discrete;

},{"../utils":10}],5:[function(require,module,exports){
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
var Timestamp = (function () {
    function Timestamp(bucket, time) {
        this.bucket = bucket;
        this.time = time;
    }
    Timestamp.prototype.next = function () {
        return new Timestamp(this.bucket, this.time + 1);
    };
    Timestamp.prototype.compare = function (b) {
        if (this.bucket === b.bucket) {
            return this.time - b.time;
        }
        return this.bucket < b.bucket ? -1 : 1;
    };
    Timestamp.prototype.merge = function (b) {
        return this;
    };
    Timestamp.prototype.equal = function (b) {
        return false;
    };
    return Timestamp;
}());
exports.Timestamp = Timestamp;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var functions_1 = require("../functions");
var Delete = (function () {
    function Delete(at, length) {
        this.at = at;
        this.length = length;
    }
    Delete.prototype.apply = function (data) {
        if (this.at < 0)
            return data;
        data = utils_1.ensureArrayLength(data, this.at);
        return functions_1.concat(data.slice(0, this.at), data.slice(this.at + this.length));
    };
    return Delete;
}());
exports.Delete = Delete;

},{"../functions":1,"../utils":10}],8:[function(require,module,exports){
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

},{"../functions":1,"./delete":7,"./insert":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var functions_1 = require("../functions");
var Insert = (function () {
    function Insert(at, value) {
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
    }
    Insert.prototype.apply = function (data) {
        data = utils_1.ensureArrayLength(data, this.at);
        return functions_1.concat(functions_1.concat(data.slice(0, this.at), this.value.split('')), data.slice(this.at));
    };
    return Insert;
}());
exports.Insert = Insert;

},{"../functions":1,"../utils":10}],10:[function(require,module,exports){
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
    for (var i in obj) {
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
    return Object.keys(a).reduce(function (r, k) {
        if (b.hasOwnProperty(k)) {
            r.push(k);
        }
        return r;
    }, []).sort();
}
exports.common = common;

},{}]},{},[3])(3)
});