'use strict';

const {createVectorClock} = require('../../build/order');
const {compare, axioms} = require('../../build/functions');
const assert = require('assert');

describe('order/VectorClock', () => {
  const a0 = createVectorClock('a', 0);
  const b0 = createVectorClock('b', 0);
  const c0 = createVectorClock('c', 0);

  // Actor A do work
  const a1 = a0.next();
  // Actor B merge changes send by A (a:1)
  const b1a1 = b0.next().merge(a1);
  // Actor B do work
  const b2a1 = b1a1.next();
  // Actor A merge changes send by B (b:2 a:1)
  const a2b2 = a1.next().merge(b2a1);
  // Actor A make snapshot of changes
  const a3b2 = a2b2.next();
  // Actor C start geting new messages
  const c2a3b2 = c0.next().merge(a3b2).next().merge(b2a1);

  describe('deterministic order', () => {
    const rand = () => Math.random() > 0.5 ? -1 : 1;
    const useCases = {
      'should existit for actor A':  {
        in: [a0, a1, a2b2, a3b2].sort(rand),
        out: [a0, a1, a2b2, a3b2]
      },
      'should existit for actor B':  {
        in: [b0, b1a1, b2a1].sort(rand),
        out: [b0, b1a1, b2a1]
      },
      'should existit for actor C':  {
        in: [c0, c2a3b2].sort(rand),
        out: [c0, c2a3b2]
      },
    };

    Object.keys(useCases).forEach(name => {
      const useCase = useCases[name];
      it(name, () => {
        assert.deepEqual(
          useCase.in.sort(compare),
          useCase.out
        );
      });
    });
  });

  const useCases = {
    'same version should be equal': {
      a: a1,
      b: a1,
      expected: 0
    },
    'previous version should be before than next': {
      a: a1,
      b: a0,
      expected: 1
    },
    'next version should be after than previous': {
      a: a0,
      b: a1,
      expected: -1
    },
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
    axioms(assert, a0, c0, a3b2);
  });
});
