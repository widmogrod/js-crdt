import { Orderer } from "./orderer";
import { Operation } from "./operation";
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
export declare class Text {
    order: Orderer<any>;
    map: OrderedMap<Orderer<any>, Operation[]>;
    constructor(order: Orderer<any>, map: OrderedMap<Orderer<any>, Operation[]>);
    next(): Text;
    apply(operation: Operation): OrderedOperations;
    mergeOperations(o: OrderedOperations): Text;
    merge(b: Text): Text;
    equal(b: Text): boolean;
    reduce<R>(fn: (aggregator: R, item: OrderedOperations) => R, accumulator: any): R;
    from(version: Orderer<any>, inclusive?: boolean): OrderedOperations[];
    to(version: Orderer<any>, inclusive?: boolean): OrderedOperations[];
}
