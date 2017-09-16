'use strict';

const {Insert, Delete, Selection, snapshot, renderString, createFromOrderer, getSelection} = require('../../build/text');
const {VectorClock, createVectorClock} = require('../../build/order');
const {merge, axioms} = require('../../build/functions');
const assert = require('assert');

function createOrderer(id, vector) {
  return createVectorClock(id, 0, vector)
}

describe('text.Text', () => {
  const origin = createOrderer('origin');

  describe('axioms for ordered inserts', () => {
    let a, b, c;

    beforeEach(() => {
      a = createFromOrderer(createOrderer('a', origin.vector));
      a.apply(new Insert(0, 'abc'));

      b = createFromOrderer(createOrderer('b', origin.vector));
      b.apply(new Insert(0, 'def'));

      c = createFromOrderer(createOrderer('c', origin.vector));
      c.apply(new Insert(0, 'ghi'));
    });

    it('should obey CRDT axioms', () => {
      axioms(assert, a, b, c);
    });

    it('should converge to text', () => {
      const merged = merge(merge(a, b), c);

      assert.equal(renderString(merged), 'ghidefabc');
    });
  });

  describe('axioms for ordered inserts and deletes', () => {
    let a, b, c;

    beforeEach(() => {
      a = createFromOrderer(createOrderer('a', origin.vector));
      a.apply(new Insert(0, 'abc'));
      a.apply(new Delete(0, 1));

      b = createFromOrderer(createOrderer('b', origin.vector));
      b.apply(new Insert(0, 'def'));
      b.apply(new Delete(0, 1));

      c = createFromOrderer(createOrderer('c', origin.vector));
      c.apply(new Insert(0, 'ghi'));
      c.apply(new Delete(0, 1));
    });

    it('should obey CRDT axioms', () => {
      axioms(assert, a, b, c);
    });

    it('should converge to text', () => {
      const merged = merge(merge(a, b), c);

      assert.equal(renderString(merged), 'hiefbc');
    });
  });

  describe('set of complex merging operations (integration more like tests)', () => {
    let a, b;

    it('conflict', () => {
      a = createFromOrderer(createOrderer('a', origin.vector));
      b = createFromOrderer(createOrderer('b', origin.vector));

      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));

      a.apply(new Insert(0, 'a'));
      b = merge(b, a);
      a = snapshot(a);

      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));

      a.apply(new Insert(1, 'a'));
      b = merge(b, a);
      a = snapshot(a);

      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));

      a.apply(new Insert(2, 'a'));
      b = merge(b, a);
      a = snapshot(a);


      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));

      b.apply(new Insert(3, 'b'));
      a = merge(a, b);
      b = snapshot(b);

      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));

      a.apply(new Insert(0, 'c'));
      b = merge(b, a);
      a = snapshot(a);

      assert(a.order.id !== b.order.id);
      assert(!a.order.equal(b.order));

      assert.equal(renderString(a), 'caaab');
      assert.equal(renderString(b), 'caaab');
    });
  });

  describe("selection", () => {
    let doc = createFromOrderer(createOrderer('a'));
    let fallback = new Selection("new", 0, 0);

    describe('selection-cursor', () => {
      it('shoud fallback to default selection-cursor when there is no operations', () => {
        let result = getSelection(doc, fallback);
        let expected = new Selection("new", 0, 0);
        assert.deepEqual(result, expected);
      });
      it('shoud move selection-cursor when insert done on the same position', () => {
        let next = doc.next()

        next.apply(new Insert(0, 'abc'));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 3, 0);
        assert.deepEqual(result, expected);
      });
      it('shoud move selection-cursor when delete done before seletion', () => {
        let next = doc.next()

        next.apply(new Selection("new", 4, 0));
        next.apply(new Delete(0, 2));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 2, 0);
        assert.deepEqual(result, expected);
      });
      it('shoud move chose mose recent selection-cursor if available', () => {
        let next = doc.next()

        next.apply(new Insert(0, 'abc'));
        next.apply(new Selection("new", 2, 0));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 2, 0);
        assert.deepEqual(result, expected);
      });
    });

    describe('selection-range', () => {
      it('shoud move selection-range when insert done before selection', () => {
        let next = doc.next()

        next.apply(new Selection("new", 5, 4));
        next.apply(new Insert(1, 'abc'));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 8, 4);
        assert.deepEqual(result, expected);
      });
      it('shoud move selection-range when insert done between selection', () => {
        let next = doc.next()

        next.apply(new Selection("new", 2, 4));
        next.apply(new Insert(3, 'abc'));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 2, 7);
        assert.deepEqual(result, expected);
      });
      it('shoud do not move selection-range when insert done after selection', () => {
        let next = doc.next()

        next.apply(new Selection("new", 2, 4));
        next.apply(new Insert(10, 'abc'));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 2, 4);
        assert.deepEqual(result, expected);
      });
      it('shoud collaps selection-range when delete done between selection', () => {
        let next = doc.next()

        next.apply(new Selection("new", 2, 6));
        next.apply(new Delete(3, 2));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 2, 4);
        assert.deepEqual(result, expected);
      });
      it('shoud move and reduce selection-range when delete done before selection but ends inside selection', () => {
        let next = doc.next()

        next.apply(new Selection("new", 4, 8));
        next.apply(new Delete(2, 6));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 2, 4);
        assert.deepEqual(result, expected);
      });
      it('shoud do not move selection-range when delete done after', () => {
        let next = doc.next()

        next.apply(new Selection("new", 4, 2));
        next.apply(new Delete(9, 2));

        let result = getSelection(next, fallback);
        let expected = new Selection("new", 4, 2);
        assert.deepEqual(result, expected);
      });
    });
  });
});
