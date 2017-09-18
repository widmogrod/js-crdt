'use strict';

const {Insert, Delete, Selection, snapshot, renderString, createFromOrderer} = require('../../build/text');
const {getSelection, getSelections} = require('../../build/text');
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

  describe("renderString", () => {
    let doc = createFromOrderer(createOrderer('a'));

    it('should render new line', () => {
      let next = doc.next();
      next.apply(new Insert(0, "\n"));
      assert.equal(renderString(next), "\n");
    });

    it('should render new line considering position', () => {
      let next = doc.next();
      next.apply(new Insert(2, "\n"));
      assert.equal(renderString(next), "  \n");
    });
  });

  describe("getSelection", () => {
    let doc = createFromOrderer(createOrderer('a'));
    let fallback = new Selection("new", 0, 0);

    describe('selection-cursor', () => {
      describe('insert', () => {
        it('shoud fallback to default selection-cursor when there is no operations', () => {
          let result = getSelection(doc, fallback);
          let expected = new Selection("new", 0, 0);
          assert.deepEqual(result, expected);
        });
        it('shoud move selection-cursor when insert is done before cursor position', () => {
          let next = doc.next()

          next.apply(new Selection("new", 2, 0));
          next.apply(new Insert(1, 'abc'));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 5, 0);
          assert.deepEqual(result, expected);
        });
        it('shoud leave selection-cursor at current position when insert is done on the same position', () => {
          let next = doc.next()

          next.apply(new Selection("new", 1, 0));
          next.apply(new Insert(1, 'abc'));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 1, 0);
          assert.deepEqual(result, expected);
        });
      });

      describe('delete', () => {
        it('shoud move selection-cursor when delete done before seletion', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 0));
          next.apply(new Delete(0, 2));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 2, 0);
          assert.deepEqual(result, expected);
        });
        it('shoud leave selection-cursor at current position when delete is done on the same position', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 0));
          next.apply(new Delete(4, 2));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 4, 0);
          assert.deepEqual(result, expected);
        });
        it('shoud leave selection-cursor at current position when delete is done after cursor position', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 0));
          next.apply(new Delete(5, 2));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 4, 0);
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
    });

    describe('selection-range', () => {
      describe('insert', () => {
        it('shoud move selection-range when insert done before selection', () => {
          let next = doc.next()

          next.apply(new Selection("new", 5, 4));
          next.apply(new Insert(1, 'abc'));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 8, 4);
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
        it('shoud do not move selection-range when insert at the end of selection', () => {
          let next = doc.next()

          next.apply(new Selection("new", 2, 4));
          next.apply(new Insert(6, 'abc'));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 2, 4);
          assert.deepEqual(result, expected);
        });
        it('shoud move selection-range at current position when insert is done on the same position', () => {
          let next = doc.next()

          next.apply(new Selection("new", 5, 4));
          next.apply(new Insert(5, 'abc'));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 8, 4);
          assert.deepEqual(result, expected);
        });
        it('shoud expand selection-range when insert done between selection', () => {
          let next = doc.next()

          next.apply(new Selection("new", 2, 4));
          next.apply(new Insert(3, 'abc'));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 2, 7);
          assert.deepEqual(result, expected);
        });
      });

      describe('delete', () => {
        it('shoud collaps selection-range when delete done between selection', () => {
          let next = doc.next()

          next.apply(new Selection("new", 2, 6));
          next.apply(new Delete(2, 2));

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
        it('shoud reduce selection-range when delete starts inside selection but ends outside of it', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 3));
          next.apply(new Delete(5, 5));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 4, 1);
          assert.deepEqual(result, expected);
        });
        it('shoud reduce selection-range to cursor when whole selected text is deleted', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 2));
          next.apply(new Delete(4, 2));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 4, 0);
          assert.deepEqual(result, expected);
        });
        it('shoud reduce selection-range to cursor and move it to deletion position when whole selected text is deleted outside selection', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 2));
          next.apply(new Delete(2, 8));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 2, 0);
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
        it('shoud move selection-range when delete done before selection', () => {
          let next = doc.next()

          next.apply(new Selection("new", 4, 2));
          next.apply(new Delete(1, 2));

          let result = getSelection(next, fallback);
          let expected = new Selection("new", 2, 2);
          assert.deepEqual(result, expected);
        });
      });
    });
  });

  describe("getSelections", () => {
    let doc = createFromOrderer(createOrderer('a'));
    let fallback = new Selection("new", 0, 0);

    it('should return all selections but aggregated to latest', () => {
      let next = doc.next()

      next.apply(new Selection("a", 4, 2));
      next.apply(new Selection("b", 0, 0));
      next.apply(new Selection("b", 1, 1));
      next.apply(new Selection("c", 1, 1));

      let result = getSelections(next, fallback);
      let expected = {
        "new": new Selection("new", 0, 0),
        "a": new Selection("a", 4, 2),
        "b": new Selection("b", 1, 1),
        "c": new Selection("c", 1, 1),
      };

      assert.deepEqual(result.data, expected);
    });
    it('should expand range of selection-ranges when insert done inside them', () => {
      let next = doc.next()

      next.apply(new Selection("a", 4, 2));
      next.apply(new Selection("b", 4, 2));
      next.apply(new Selection("c", 4, 2));
      next.apply(new Insert(5, 'abc'));

      let result = getSelections(next, fallback);
      let expected = {
        "new": new Selection("new", 0, 0),
        "a": new Selection("a", 4, 5),
        "b": new Selection("b", 4, 5),
        "c": new Selection("c", 4, 5),
      };

      assert.deepEqual(result.data, expected);
    });
  });
});
