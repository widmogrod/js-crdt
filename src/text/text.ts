import {merge,  equal} from '../functions'
import {Orderer} from './orderer'
import {SetMap, Indexed} from '../structures/set-map'
import {NaiveImmutableMap} from '../structures/naive-immutable-map'
import {SortedSetArray} from '../structures/sorted-set-array'
import {NaiveArrayList} from '../structures/naive-array-list'

export class Text<T> {
  constructor(public order: Orderer<any>, public setMap?: SetMap<Orderer<any>, T[]>) {
    this.setMap = setMap || new SetMap(
      new SortedSetArray(
        new NaiveArrayList([])),
      new NaiveImmutableMap()
    );
  }

  next(): Text<T> {
    return new Text(
      this.order.next(),
      this.setMap,
    );
  }

  apply(operation: T) {
    let value = this.setMap.get(this.order);

    if (!value) {
      value = [];
    }

    value.push(operation);
    this.setMap = this.setMap.set(this.order, value);
  }

  merge(b: Text<T>): Text<T> {
    return new Text(
      merge(this.order, b.order),
      this.setMap.merge(b.setMap)
    );
  }

  equal(b: Text<T>): boolean {
    return equal(this.order, b.order);
  }

  reduce<R>(fn: (aggregator: R, operations: T[], order: Orderer<any>) => R, accumulator): R {
    return this.setMap.reduce((accumulator, operations, order) => {
      return fn(accumulator, operations, order);
    }, accumulator);
  }
}
