'use strict';

const Text = require('../../src/text/text');
const Insert = require('../../src/text/insert');
const Delete = require('../../src/text/delete');
const Discrete = require('../../src/order/discrete');
const f = require('../../src/functions');
const assert = require('assert');

function D(id, vector) {
  return new Discrete(id, vector);
}

function snapshot(text) {
  return new Text(
    text.order.next(),
    text.ordersIndex,
    text.operationsIndex
  );
}

function lastPosition(text) {
  return text.reduce(function(position, operation, order) {
    if (order.id !== text.order.id) {
      return position;
    }

    if (operation instanceof Insert) {
      return operation.at + operation.value.length;
    } else {
      return operation.at - operation.length;
    }
  }, 0);
}

describe('Text', () => {
  const origin = D('origin', {origin: 0});

  describe('axioms for ordered inserts', () => {
    let a, b, c;

    beforeEach(() => {
      a = new Text(D('a', origin.vector));
      a.apply(new Insert(0, 'abc'));

      b = new Text(D('b', origin.vector));
      b.apply(new Insert(0, 'def'));

      c = new Text(D('c', origin.vector));
      c.apply(new Insert(0, 'ghi'));
    });

    it('should obey CRDT axioms', () => {
      f.axioms(assert, a, b, c)
    });

    it('should converge to text', () => {
      const merged = f.merge(f.merge(a, b), c);
      assert.equal(merged.toString(), 'ghidefabc');
    });
  });

  describe('axioms for ordered inserts and deletes', () => {
    let a, b, c;

    beforeEach(() => {
      a = new Text(D('a', origin.vector));
      a.apply(new Insert(0, 'abc'));
      a.apply(new Delete(0, 1));

      b = new Text(D('b', origin.vector));
      b.apply(new Insert(0, 'def'));
      b.apply(new Delete(0, 1));

      c = new Text(D('c', origin.vector));
      c.apply(new Insert(0, 'ghi'));
      c.apply(new Delete(0, 1));
    });

    it('should obey CRDT axioms', () => {
      f.axioms(assert, a, b, c)
    });

    it('should converge to text', () => {
      const merged = f.merge(f.merge(a, b), c);
      assert.equal(merged.toString(), 'hiefbc');
    });
  });

  describe('set of complex merging operations (integration more like tests)', () => {
    let a, b, _;
    it('conflict', () => {
      a = new Text(D('a', origin.vector));
      b = new Text(D('b', origin.vector));

      assert.equal(a.index, 0);
      assert.equal(b.index, 0);
      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));
      assert(lastPosition(a) === 0);
      assert(lastPosition(b) === 0);

      _ = a.apply(new Insert(0, 'a'));
      b = f.merge(b, a);
      a = snapshot(a);

      assert.equal(a.index, 1);
      assert.equal(b.index, 2);
      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));
      assert(lastPosition(a) === 1);
      assert(lastPosition(b) === 0);

      _ = a.apply(new Insert(1, 'a'));
      b = f.merge(b, a);
      a = snapshot(a);

      assert.equal(a.index, 2);
      assert.equal(b.index, 4);
      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));
      assert(lastPosition(a) === 2);
      assert(lastPosition(b) === 0);

      _ = a.apply(new Insert(2, 'a'));
      b = f.merge(b, a);
      a = snapshot(a);


      assert.equal(a.index, 3);
      assert.equal(b.index, 6);
      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));
      assert(lastPosition(a) === 3);
      assert(lastPosition(b) === 0);

      _ = b.apply(new Insert(3, 'b'));
      a = f.merge(a, b);
      b = snapshot(b);

      assert.equal(a.index, 8);
      assert.equal(b.index, 7);
      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));
      assert(lastPosition(a) === 3);
      assert(lastPosition(b) === 4);

      _ = a.apply(new Insert(0, 'c'));
      b = f.merge(b, a);
      a = snapshot(a);

      assert.equal(a.index, 9);
      assert.equal(b.index, 10);
      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));
      assert.equal(lastPosition(a), 1);
      assert.equal(lastPosition(b), 4);

      assert.equal(a.toString(), 'caaab');
      assert.equal(b.toString(), 'caaab');
    });
  });
});
