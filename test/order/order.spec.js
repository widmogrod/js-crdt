'use strict';

const Order = require('../../src/order/order');
const f = require('../../src/functions');
const assert = require('assert');

describe('Order', () => {
  const useCases = {
    'should be less than given, since "a" is made earlier': {
      a: new Order('a', 0),
      b: new Order('a', 1),
      expected: -1
    },
    'should be grater than given, since "a" is made later': {
      a: new Order('a', 2),
      b: new Order('a', 1),
      expected: 1
    },
    'should be same, since bucket and time are the same': {
      a: new Order('a', 1),
      b: new Order('a', 1),
      expected: 0
    },
    'should be less that "b", since bucket "a" is earlier in natural order': {
      a: new Order('a', 1),
      b: new Order('b', 1),
      expected: -1
    },
    'should be less that "b", since bucket "a" is earlier in natural order and time wise also': {
      a: new Order('a', 0),
      b: new Order('b', 1),
      expected: -1
    },
    'should be grater than "b" even if bucket if earlier in natural order, but time is later': {
      a: new Order('a', 2),
      b: new Order('b', 1),
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

  it('operations should be grouped by bucket and then time', () => {
    assert.deepEqual(
      [new Order('c', 2), new Order('a', 1), new Order('a', 2), new Order('c', 1)].sort(f.compare),
      [new Order('a', 1), new Order('a', 2), new Order('c', 1), new Order('c', 2)]
    );
  });
});
