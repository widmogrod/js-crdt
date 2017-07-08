'use strict';

const f = require('../src/functions');
const {Increment} = require('../src/increment');
const assert = require('assert');

describe('Increment', () => {
  describe('#url()', () => {
    let a,b,c;

    beforeEach(() => {
      a = new Increment(1);
      b = new Increment(3);
      c = new Increment(7);
    });

    it('should obey CRDT axioms', function() {
      f.axioms(assert, a, b, c);
    });
  });
});
