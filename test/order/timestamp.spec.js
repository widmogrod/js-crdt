'use strict';

const Timestamp = require('../../build/order').Timestamp;
const f = require('../../build/functions');
const assert = require('assert');

describe('Timestamp', () => {
  const useCases = {
    'should be less than given, since "a" is made earlier': {
      a: new Timestamp('a', 0),
      b: new Timestamp('a', 1),
      expected: -1
    },
    'should be grater than given, since "a" is made later': {
      a: new Timestamp('a', 2),
      b: new Timestamp('a', 1),
      expected: 1
    },
    'should be same, since bucket and time are the same': {
      a: new Timestamp('a', 1),
      b: new Timestamp('a', 1),
      expected: 0
    },
    'should be less that "b", since bucket "a" is earlier in natural Timestamp': {
      a: new Timestamp('a', 1),
      b: new Timestamp('b', 1),
      expected: -1
    },
    'should be less that "b", since bucket "a" is earlier in natural Timestamp and time wise also': {
      a: new Timestamp('a', 0),
      b: new Timestamp('b', 1),
      expected: -1
    },
    'should be grater than "b" even if bucket if earlier in natural Timestamp, but time is later': {
      a: new Timestamp('a', 2),
      b: new Timestamp('b', 1),
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
      [new Timestamp('c', 2), new Timestamp('a', 1), new Timestamp('a', 2), new Timestamp('c', 1)].sort(f.compare),
      [new Timestamp('a', 1), new Timestamp('a', 2), new Timestamp('c', 1), new Timestamp('c', 2)]
    );
  });
});
