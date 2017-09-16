const assert = require('assert');
const {OrderedMap} = require('../../src/structures/ordered-map');
const {SortedSetArray} = require('../../src/structures/sorted-set-array');
const {NaiveImmutableMap} = require('../../src/structures/naive-immutable-map');
const {NaiveArrayList} = require('../../src/structures/naive-array-list');

class Cmp {
  constructor(value) {
    this.value = value;
  }
  compare(b) {
    return this.value.localeCompare(b.value);
  }
}

describe('OrderedMap', () => {
  const a = new Cmp('a');

  it('should be immutable', () => {
    const sm1 = new OrderedMap(
      new SortedSetArray(new NaiveArrayList([])),
      new NaiveImmutableMap()
    );

    const sm2 = sm1.set(a, '1');
    assert(null === sm1.get(a));
    assert('1' === sm2.get(a));
  });
});
