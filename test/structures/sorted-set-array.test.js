const assert = require('assert');
const {SortedSetArray} = require('../../src/structures/sorted-set-array');
const {NaiveArrayList} = require('../../src/structures/naive-array-list');

class Cmp {
  constructor(value) {
    this.value = value;
  }
  compare(b) {
    return this.value.localeCompare(b.value);
  }
}

describe('SortedSetArray', () => {
  const a = new Cmp('a');
  const b = new Cmp('b');
  const c = new Cmp('c');

  it('should be immutable', () => {
    const set1 = new SortedSetArray(new NaiveArrayList([]));
    assert(set1.size() === 0);

    const set2 = set1.add(a).result;
    assert(set1.size() === 0);
    assert(set2.size() === 1);
    assert(set2 !== set1);

    assert(set2.add(a).result === set2);

    const set3 = set2.add(b).result;
    assert(set1.size() === 0);
    assert(set2.size() === 1);
    assert(set3.size() === 2);
    assert(set3 !== set2);

    const set4 = set3.add(c).result;
    assert(set1.size() === 0);
    assert(set2.size() === 1);
    assert(set3.size() === 2);
    assert(set4.size() === 3);

    const set5 = set4.add(c).result;
    assert(set1.size() === 0);
    assert(set2.size() === 1);
    assert(set3.size() === 2);
    assert(set4.size() === 3);
    assert(set5 === set4);
    assert(set5.size() === 3);
  });
});
