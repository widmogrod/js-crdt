import { Orderer } from "./orderer";
export interface SetMap<K, V> {
    set(key: K, value: V): SetMap<K, V>;
    get?(key: K): V;
    merge(b: SetMap<K, V>): SetMap<K, V>;
    reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
}
export declare class Text<T> {
    order: Orderer<any>;
    setMap: SetMap<Orderer<any>, T[]>;
    constructor(order: Orderer<any>, setMap: SetMap<Orderer<any>, T[]>);
    next(): Text<T>;
    apply(operation: T): void;
    merge(b: Text<T>): Text<T>;
    equal(b: Text<T>): boolean;
    reduce<R>(fn: (aggregator: R, operations: T[], order: Orderer<any>) => R, accumulator: any): R;
}
