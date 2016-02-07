'use strict';

exports.merge = merge;
function merge(a, b) {
  return a.merge(b);
}

exports.equal = equal;
function equal(a, b) {
  return a.equal(b);
}

exports.axioms = axioms;
function axioms(assert, a, b, c) {
  assert(
    equal(merge(a, b), merge(b, a)),
    'is not commutative'
  );

  assert(
    equal(merge(a, merge(b, c)), merge(merge(a, b), c)),
    'is not associative'
  );

  assert(
    equal(merge(a, a), a),
    'is idempotent?'
  );
}
