const assert = require('assert');
const {NaiveArrayList} = require('../../src/structures/naive-array-list');

describe('NaiveArrayList', () => {
  it('should be immutable', () => {
    const list1 = new NaiveArrayList([]);
    assert(list1.size() === 0);

    const list2 = list1.insert(0, 'a');
    assert(list1.size() === 0);
    assert(list2.size() === 1);

    const list3 = list2.insert(0, 'b');
    assert(list1.size() === 0);
    assert(list2.size() === 1);
    assert(list3.size() === 2);

    assert(list3.array.join('') === 'ba');
  });

  describe('from', () => {
    const list = new NaiveArrayList([])
      .insert(0, 'a')
      .insert(1, 'b')
      .insert(2, 'c');

    it('should return values from inclusive', () => {
      assert.deepEqual(list.from(0).array, ['a', 'b', 'c']);
      assert.deepEqual(list.from(1).array, ['b', 'c']);
      assert.deepEqual(list.from(2).array, ['c']);
      assert.deepEqual(list.from(3).array, []);
    });

    it('should return values from exclusive', () => {
      assert.deepEqual(list.from(0, false).array, ['b', 'c']);
      assert.deepEqual(list.from(1, false).array, ['c']);
      assert.deepEqual(list.from(2, false).array, []);
      assert.deepEqual(list.from(3, false).array, []);
    });
  });

  describe('to', () => {
    const list = new NaiveArrayList([])
      .insert(0, 'a')
      .insert(1, 'b')
      .insert(2, 'c');

    it('should return values to inclusive', () => {
      assert.deepEqual(list.to(0).array, ['a']);
      assert.deepEqual(list.to(1).array, ['a', 'b']);
      assert.deepEqual(list.to(2).array, ['a', 'b', 'c']);
      assert.deepEqual(list.to(3).array, ['a', 'b', 'c']);
    });

    it('should return values to exclusive', () => {
      assert.deepEqual(list.to(0, false).array, []);
      assert.deepEqual(list.to(1, false).array, ['a']);
      assert.deepEqual(list.to(2, false).array, ['a', 'b']);
      assert.deepEqual(list.to(3, false).array, ['a', 'b', 'c']);
    });
  });
});
