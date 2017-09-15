import {equal,  merge} from "../functions";
import {Orderer} from "./orderer";
import {Operation} from "./utils";

export interface OrderedMap<K, V> {
  set(key: K, value: V): OrderedMap<K, V>;
  get?(key: K): V;
  merge(b: OrderedMap<K, V>): OrderedMap<K, V>;
  reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
}

export interface OrderedOperations {
  order: Orderer<any>;
  operations: Operation[];
}

export class Text {
  constructor(public order: Orderer<any>, public setMap: OrderedMap<Orderer<any>, Operation[]>) {}

  public next(): Text {
    return new Text(
      this.order.next(),
      this.setMap,
    );
  }

  public apply(operation: Operation): OrderedOperations {
    let operations = this.setMap.get(this.order);

    if (!operations) {
      operations = [] as Operation[];
    }

    operations.push(operation);
    this.setMap = this.setMap.set(this.order, operations);

    return {
      operations,
      order: this.order,
    };
  }

  public mergeOperations(o: OrderedOperations): Text {
    return new Text(
      merge(this.order, o.order),
      this.setMap.set(o.order, o.operations),
    );
  }

  public merge(b: Text): Text {
    return new Text(
      merge(this.order, b.order),
      merge(this.setMap, b.setMap),
    );
  }

  public equal(b: Text): boolean {
    return equal(this.order, b.order);
  }

  public reduce<R>(fn: (aggregator: R, item: OrderedOperations) => R, accumulator): R {
    return this.setMap.reduce((accumulator, operations, order) => {
      return fn(accumulator, {operations, order});
    }, accumulator);
  }
}
