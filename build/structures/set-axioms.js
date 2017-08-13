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
    assert(equal(union(union(a, b), c), union(a, union(b, c))), 'associative union');
    assert(equal(intersect(intersect(a, b), c), intersect(a, intersect(b, c))), 'associative intersect');
    assert(equal(union(a, intersect(b, c)), union(intersect(a, b), intersect(a, c))), 'union distributes over intersection');
    assert(equal(intersect(a, union(b, c)), intersect(union(a, b), union(a, c))), 'intersection distributes over union');
    assert(equal(difference(a, union(b, c)), intersect(difference(a, b), difference(a, c))), 'De Morgan\'s law for union');
    assert(equal(difference(a, intersect(b, c)), union(difference(a, b), difference(a, c))), 'De Morgan\'s law for intersect');
}
exports.axioms = axioms;
//# sourceMappingURL=set-axioms.js.map