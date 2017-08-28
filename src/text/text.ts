import {merge,  equal} from '../functions'
import {Orderer} from './orderer'

export interface SetMap<K,V> {
  set(key: K, value: V): SetMap<K,V>
  get?(key: K): V
  merge(b: SetMap<K,V>): SetMap<K,V>
  reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R
}

export class Text<T> {
  constructor(public order: Orderer<any>, public setMap: SetMap<Orderer<any>, T[]>) {}

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
