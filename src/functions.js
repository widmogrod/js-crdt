"use strict";
var functions;
(function (functions) {
    function merge(a, b) {
        return a.merge(b);
    }
    functions.merge = merge;
    function equal(a, b) {
        return a.equal(b);
    }
    functions.equal = equal;
    function compare(a, b) {
        return a.compare(b);
    }
    functions.compare = compare;
    function concat(a, b) {
        return a.concat(b);
    }
    functions.concat = concat;
    function applyOperation(operation, data) {
        return operation.apply(data);
    }
    functions.applyOperation = applyOperation;
    function axioms(assert, a, b, c) {
        // commutative   a + c = c + a                i.e: 1 + 2 = 2 + 1
        assert(equal(merge(a, b), merge(b, a)), 'is not commutative');
        // associative   a + (b + c) = (a + b) + c    i.e: 1 + (2 + 3) = (1 + 2) + 3
        assert(equal(merge(a, merge(b, c)), merge(merge(a, b), c)), 'is not associative');
        // idempotent    f(f(a)) = f(a)               i.e: ||a|| = |a|
        assert(equal(merge(a, a), a), 'is not idempotent');
    }
    functions.axioms = axioms;
})(functions = exports.functions || (exports.functions = {}));
