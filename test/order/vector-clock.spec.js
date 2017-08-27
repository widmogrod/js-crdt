'use strict';

const {VectorClock} = require('../../build/order');
const {compare, axioms} = require('../../build/functions');
const assert = require('assert');

function d(id, vector) {
  return new VectorClock(id, vector);
}

describe('order/VectorClock', () => {
  const o = d('origin', {origin: 0});
  const a0 = d('a', o.vector);
  const b0 = d('b', o.vector);
  const c0 = d('c', o.vector);

  // Actor A sends (a:0) to B
  const a1 = a0.next();

  // Actor B merge changes send by A (a:0)
  const b1a0 = b0.merge(a0).next();
  // Actor B send changes to A
  const b2a0 = b1a0.next();

  // Actor A merge changes send by B (b:1 a:0)
  const a2b1 = a1.merge(b1a0).next();
  // Actor A make snapshot of changes
  const a3b1 = a2b1.next();

  // Actor C work offline
  const c1 = c0.next();

  // Actor C start geting new messages
  const c2 = c1.merge(a3b1).merge(b2a0).next();

  const orderOfEvents = [o, a0, b0, c0, c1, b1a0, b2a0, a1, a2b1, a3b1, c2];

  it('should have deterministic order', () => {
    assert.deepEqual(compare(o, a0), -1);
    assert.deepEqual(compare(a0, b0), -1);
    assert.deepEqual(compare(b0, c0), -1);
    assert.deepEqual(compare(c0, c1), -1);
    assert.deepEqual(compare(c0, b1a0), -1);
    assert.deepEqual(compare(c1, b1a0), -1);
    assert.deepEqual(compare(b1a0, b2a0), -1);
    assert.deepEqual(compare(b2a0, a1 ), -1);
    assert.deepEqual(compare(a1, a2b1 ), -1);
    assert.deepEqual(compare(a2b1, a3b1 ), -1);
    assert.deepEqual(compare(a3b1, c2), -1);

    assert.deepEqual(
      [o, a0, b0, c0, b1a0, b2a0, a1, c2, a2b1, c1, a3b1].sort(compare),
      orderOfEvents
    );
  });

  const useCases = {
    'same version should be equal': {
      a: o,
      b: o,
      expected: 0
    },
    'origin should be before b0': {
      a: o,
      b: b0,
      expected: -1
    },
    'b0 should be after origin': {
      a: b0,
      b: o,
      expected: 1
    },
    'when "same" version is matched, then lexical order should be applied a < b': {
      a: a0,
      b: b0,
      expected: -1
    },
    'when "same" version is matched, then lexical order should be applied b > a': {
      a: b0,
      b: a0,
      expected: 1
    },
    'sequence of versions on the same branch a:0 < a:1': {
      a: a0,
      b: a1,
      expected: -1
    },
    'sequence of versions on the same branch a:1 > a:0': {
      a: a1,
      b: a0,
      expected: 1
    },
    'more advanced version should be next in order a:1 > b:0': {
      a: a1,
      b: b0,
      expected: 1
    },
    'less advanced version should be previous in order b:0 < a:1': {
      a: b0,
      b: a1,
      expected: -1
    }
  };

  Object.keys(useCases).forEach(name => {
    const useCase = useCases[name];

    it(name, () => {
      assert.deepEqual(
        compare(useCase.a, useCase.b),
        useCase.expected
      );
    });
  });

  it('should obey CRDTs axioms', () => {
    axioms(assert, a0, c0, a3b1);
  });
});
