'use strict';

const {Increment} = require('../build/increment');
const {axioms} = require('../build/functions');
const assert = require('assert');

describe('Increment', () => {
  let a,b,c;

  beforeEach(() => {
    a = new Increment(1);
    b = new Increment(3);
    c = new Increment(7);
  });

  it('should obey CRDT axioms', function() {
    axioms(assert, a, b, c);
  });
});
