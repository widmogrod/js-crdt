export declare type Key = string | number;
export declare class NaiveImmutableMap<V> {
    private data;
    constructor(data?: any);
    set(key: Key, value: V): NaiveImmutableMap<V>;
    get?(key: Key): V;
    reduce<R>(fn: (aggregator: R, values: V, key: string) => R, aggregator: R): R;
}
