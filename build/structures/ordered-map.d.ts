export declare type ReduceFunc<R, T> = (aggregator: R, item: T) => R;
export interface MapSetKey<T> {
    compare(b: MapSetKey<T>): number;
}
export interface KeysTuple<A, B> {
    result: A;
    value: B;
}
export interface KeysSet<T> {
    add(item: T): KeysTuple<KeysSet<T>, T>;
    reduce<R>(fn: ReduceFunc<R, T>, accumulator: R): R;
    size(): number;
}
export interface Map<K, V> {
    set(key: K, value: V): Map<K, V>;
    get?(key: K): V;
}
export declare class Indexed<T extends MapSetKey<T>> implements MapSetKey<T> {
    value: T;
    index: number;
    constructor(value: T, index: number);
    compare(b: Indexed<T>): number;
}
export declare class OrderedMap<K extends MapSetKey<K>, V> {
    private keys;
    private values;
    constructor(keys?: KeysSet<Indexed<K>>, values?: Map<number, V>);
    set(key: K, value: V): OrderedMap<K, V>;
    get?(key: K): V;
    merge(b: OrderedMap<K, V>): OrderedMap<K, V>;
    reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
}
