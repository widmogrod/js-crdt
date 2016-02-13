'use strict';

const Discrete = require('../../src/order/discrete');
const f = require('../../src/functions');
const assert = require('assert');

function D(id, vector) {
  return new Discrete(id, vector);
};

describe('order/Discrete', () => {
/*
a:0  xxx  a:1          a:2 b:1  zzz  a:3 b:1
            |             |
b:0      b:1 a:0  yyy  b:2 a:0
c:0
*/
  const o = D('origin', {origin: 0});
  const a0 = D('a', o.vector);
  const b0 = D('b', o.vector);
  const c0 = D('c', o.vector);

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

  const orderOfEvents = [o, a0, b0, c0, b1a0, b2a0, a1, a2b1, a3b1];

  it('should have deterministic order', () => {
    assert.deepEqual(f.compare(o, a0), -1);
    assert.deepEqual(f.compare(a0, b0), -1);
    assert.deepEqual(f.compare(b0, c0), -1);
    assert.deepEqual(f.compare(c0, b1a0), -1);
    assert.deepEqual(f.compare(b1a0, b2a0), -1);
    assert.deepEqual(f.compare(b2a0, a1 ), -1);
    assert.deepEqual(f.compare(a1, a2b1 ), -1);
    assert.deepEqual(f.compare(a2b1, a3b1 ), -1);

    assert.deepEqual(
      [o, a0, b0, c0, b1a0, b2a0, a1, a2b1, a3b1].sort(f.compare),
      orderOfEvents
    )
  });

  const useCases = {
    'same should be where it is': {
      a: o,
      b: o,
      expected: 0
    },
    'b1': {
      a: o,
      b: b0,
      expected: -1
    },
    'b2': {
      a: b0,
      b: o,
      expected: 1
    },
    'lexical order 1': {
      a: a0,
      b: b0,
      expected: -1
    },
    'lexical order 2': {
      a: b0,
      b: a0,
      expected: 1
    },
    'sequencial 1': {
      a: a0,
      b: a1,
      expected: -1
    },
    'sequencial 2': {
      a: a1,
      b: a0,
      expected: 1
    },
    'diverge 1': {
      a: a1,
      b: b0,
      expected: 1
    },
    'diverge 2': {
      a: b0,
      b: a1,
      expected: -1
    },
  };

  Object.keys(useCases).forEach(name => {
    const useCase = useCases[name];
    it(name, () => {
      assert.deepEqual(
        f.compare(useCase.a, useCase.b),
        useCase.expected
      );
    });
  });

  it('should obey CRDTs axioms', () => {
    f.axioms(assert, a0, c0, a3b1);
  });
});
