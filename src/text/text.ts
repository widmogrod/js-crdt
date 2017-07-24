import {merge,  equal} from '../functions'
import {Orderer} from '../order'
import {SetMap, Indexed} from '../structures/set-map'
import {SortedSetArray} from '../structures/sorted-set-array'
import {NaiveArrayList} from '../structures/naive-array-list'

export class Text {
  constructor(public order: Orderer<any>, public setMap?: SetMap<Orderer<any>, any>) {
    this.setMap = setMap || new SetMap(
      new SortedSetArray(
        new NaiveArrayList([])),
      new Map()
    );
  }

  next() {
    return new Text(
      this.order.next(),
      this.setMap,
    );
  }

  apply(operation) {
    let value = this.setMap.get(this.order);

    if (!value) {
      value = [];
    }

    value.push(operation);
    this.setMap = this.setMap.set(this.order, value);
  }

  merge(b) {
    return new Text(
      merge(this.order, b.order).next(),
      this.setMap.merge(b.setMap)
    );
  }

  equal(b) {
    return equal(this.order,b.order);
  }

  reduce(fn, accumulator) {
    return this.setMap.reduce((accumulator, operations, order) => {
      return operations.reduce((accumulator, operation) => {
        return fn(accumulator, operation, order);
      }, accumulator);
    }, accumulator);
  }

  forEach(fn) {
    return this.setMap.reduce((_, operations, order) => {
      fn({order, operations})
      return _;
    }, null);
  }
}
