const assert = require('assert');
const {SortedSetArray} = require('../../src/structures/sorted-set-array');
const {NaiveArrayList} = require('../../src/structures/naive-array-list');
const {axioms} = require('../../src/structures/set-axioms');

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
  const d = new Cmp('d');

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


  it('should obey set axioms', () => {
    const s1 = new SortedSetArray(new NaiveArrayList([]));
    const s2 = s1.add(a).result;
    const s3 = s1.add(b).result.add(c).result;

    axioms(assert, s1, s2, s3);
  });

  describe('from', () => {
    const s_0 = new SortedSetArray(new NaiveArrayList([]));
    const s_a = s_0.add(a).result;
    const s_ab = s_a.add(b).result;
    const s_abc = s_ab.add(c).result;

    it('should return values from inclusive', () => {
      assert(s_abc.from(a).equal(s_0.add(a).result.add(b).result.add(c).result))
      assert(s_abc.from(b).equal(s_0.add(b).result.add(c).result))
      assert(s_abc.from(c).equal(s_0.add(c).result))
      assert(s_abc.from(d).equal(s_0))
    });

    it('should return values from exclusive', () => {
      assert(s_abc.from(a, false).equal(s_0.add(b).result.add(c).result))
      assert(s_abc.from(b, false).equal(s_0.add(c).result))
      assert(s_abc.from(c, false).equal(s_0))
      assert(s_abc.from(d, false).equal(s_0))
    });
  });

  describe('to', () => {
    const s_0 = new SortedSetArray(new NaiveArrayList([]));
    const s_a = s_0.add(a).result;
    const s_ab = s_a.add(b).result;
    const s_abc = s_ab.add(c).result;

    it('should return values to inclusive', () => {
      assert(s_abc.to(a).equal(s_0.add(a).result));
      assert(s_abc.to(b).equal(s_0.add(a).result.add(b).result));
      assert(s_abc.to(c).equal(s_0.add(a).result.add(b).result.add(c).result));
      assert(s_abc.to(d).equal(s_0.add(a).result.add(b).result.add(c).result));
    });

    it('should return values to exclusive', () => {
      assert(s_abc.to(a, false).equal(s_0));
      assert(s_abc.to(b, false).equal(s_0.add(a).result));
      assert(s_abc.to(c, false).equal(s_0.add(a).result.add(b).result));
      assert(s_abc.to(d, false).equal(s_0.add(a).result.add(b).result.add(c).result));
    });
  });
});
