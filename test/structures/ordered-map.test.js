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

function equal(a, b) {
  const toArray = (array, item, key) => {
    array.push([item, key]);
    return array;
  }

  assert.deepEqual(
    a.reduce(toArray, []),
    b.reduce(toArray, [])
  );
}

describe('OrderedMap', () => {
  const a = new Cmp('a');
  const b = new Cmp('b');
  const c = new Cmp('c');
  const d = new Cmp('d');

  it('should be immutable', () => {
    const sm1 = new OrderedMap(
      new SortedSetArray(new NaiveArrayList([])),
      new NaiveImmutableMap()
    );

    const sm2 = sm1.set(a, '1');
    assert(null === sm1.get(a));
    assert('1' === sm2.get(a));
  });

  describe('from', () => {
    const map0 = new OrderedMap(
      new SortedSetArray(new NaiveArrayList([])),
      new NaiveImmutableMap()
    );
    const map = map0.set(a, 1).set(b, 2).set(c, 3);

    it('should return values from inclusive', () => {
      equal(map.from(a), map0.set(a, 1).set(b, 2).set(c, 3));
      equal(map.from(b), map0.set(b, 2).set(c, 3));
      equal(map.from(c), map0.set(c, 3));
      equal(map.from(d), map0);
    });

    it('should return values from exclusive', () => {
      equal(map.from(a, false), map0.set(b, 2).set(c, 3));
      equal(map.from(b, false), map0.set(c, 3));
      equal(map.from(c, false), map0);
      equal(map.from(d, false), map0);
    });
  });

  describe('to', () => {
    const map0 = new OrderedMap(
      new SortedSetArray(new NaiveArrayList([])),
      new NaiveImmutableMap()
    );
    const map = map0.set(a, 1).set(b, 2).set(c, 3);

    it('should return values to inclusive', () => {
      equal(map.to(a), map0.set(a, 1));
      equal(map.to(b), map0.set(a, 1).set(b, 2));
      equal(map.to(c), map0.set(a, 1).set(b, 2).set(c, 3));
      equal(map.to(d), map0.set(a, 1).set(b, 2).set(c, 3));
    });

    it('should return values to exclusive', () => {
      equal(map.to(a, false), map0);
      equal(map.to(b, false), map0.set(a, 1));
      equal(map.to(c, false), map0.set(a, 1).set(b, 2));
      equal(map.to(d, false), map0.set(a, 1).set(b, 2).set(c, 3));
    });
  });
});
