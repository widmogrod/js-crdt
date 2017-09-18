import {equal, merge} from "../functions";
import {Orderer} from "./orderer";
import {Operation} from "./operation";

export interface OrderedMap<K, V> {
  set(key: K, value: V): OrderedMap<K, V>;
  get?(key: K): V;
  merge(b: OrderedMap<K, V>): OrderedMap<K, V>;
  reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
  to(key: K, inclusive: boolean): OrderedMap<K, V>;
  from(key: K, inclusive: boolean): OrderedMap<K, V>;
}

export interface OrderedOperations {
  order: Orderer<any>;
  operations: Operation[];
}

export class Text {
  constructor(public order: Orderer<any>, public map: OrderedMap<Orderer<any>, Operation[]>) {}

  public next(): Text {
    return new Text(
      this.order.next(),
      this.map,
    );
  }

  public apply(...ops: Operation[]): OrderedOperations {
    let operations = this.map.get(this.order);

    if (!operations) {
      operations = [] as Operation[];
    }

    ops.forEach((op) => operations.push(op));

    this.map = this.map.set(this.order, operations);

    return {
      operations,
      order: this.order,
    };
  }

  public mergeOperations(o: OrderedOperations): Text {
    return new Text(
      merge(this.order, o.order),
      this.map.set(o.order, o.operations),
    );
  }

  public merge(b: Text): Text {
    return new Text(
      merge(this.order, b.order),
      merge(this.map, b.map),
    );
  }

  public equal(b: Text): boolean {
    return equal(this.order, b.order);
  }

  public reduce<R>(fn: (aggregator: R, item: OrderedOperations) => R, accumulator): R {
    return this.map.reduce((accumulator, operations, order) => {
      return fn(accumulator, {operations, order});
    }, accumulator);
  }

  public from(version: Orderer<any>, inclusive: boolean = true): OrderedOperations[] {
    return this
      .map.from(version, inclusive)
      .reduce((accumulator, operations, order) => {
        accumulator.push({operations, order});
        return  accumulator;
      }, []);
  }

  public to(version: Orderer<any>, inclusive: boolean = true): OrderedOperations[] {
    return this
      .map.to(version, inclusive)
      .reduce((accumulator, operations, order) => {
        accumulator.push({operations, order});
        return  accumulator;
      }, []);
  }
}
