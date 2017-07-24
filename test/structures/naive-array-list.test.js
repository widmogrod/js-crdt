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
});
