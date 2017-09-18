export declare type ReduceFunc<R, T> = (aggregator: R, item: T) => R;
export interface OrderedMapKey<T> {
    compare(b: OrderedMapKey<T>): number;
}
export interface SortedSetTuple<A, B> {
    result: A;
    value: B;
}
export interface SortedSet<T> {
    add(item: T): SortedSetTuple<SortedSet<T>, T>;
    reduce<R>(fn: ReduceFunc<R, T>, accumulator: R): R;
    size(): number;
    from(value: T, inclusive: boolean): SortedSet<T>;
    to(value: T, inclusive: boolean): SortedSet<T>;
}
export interface Map<K, V> {
    set(key: K, value: V): Map<K, V>;
    get?(key: K): V;
}
export declare class Indexed<T extends OrderedMapKey<T>> implements OrderedMapKey<T> {
    value: T;
    index: number;
    constructor(value: T, index: number);
    compare(b: Indexed<T>): number;
}
export declare class OrderedMap<K extends OrderedMapKey<K>, V> {
    private keys;
    private values;
    constructor(keys?: SortedSet<Indexed<K>>, values?: Map<number, V>);
    set(key: K, value: V): OrderedMap<K, V>;
    get?(key: K): V;
    merge(b: OrderedMap<K, V>): OrderedMap<K, V>;
    reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
    from(key: K, inclusive?: boolean): OrderedMap<K, V>;
    to(key: K, inclusive?: boolean): OrderedMap<K, V>;
}
