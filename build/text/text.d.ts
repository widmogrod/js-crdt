import { Orderer } from "./orderer";
import { Operation } from "./utils";
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
export declare class Text {
    order: Orderer<any>;
    setMap: OrderedMap<Orderer<any>, Operation[]>;
    constructor(order: Orderer<any>, setMap: OrderedMap<Orderer<any>, Operation[]>);
    next(): Text;
    apply(operation: Operation): OrderedOperations;
    merge(b: Text): Text;
    equal(b: Text): boolean;
    reduce<R>(fn: (aggregator: R, item: OrderedOperations) => R, accumulator: any): R;
}
