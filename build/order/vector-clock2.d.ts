import { Orderer } from "./orderer";
export declare type VectorSortedSetReduceFunc<R, T> = (aggregator: R, item: T) => R;
export interface VectorSortedSetTuple<A, B> {
    result: A;
    value: B;
}
export interface VectorSortedSet<T> {
    add(item: T): VectorSortedSetTuple<VectorSortedSet<T>, T>;
    remove(item: T): VectorSortedSetTuple<VectorSortedSet<T>, T>;
    union(b: VectorSortedSet<T>): VectorSortedSet<T>;
    intersect(b: VectorSortedSet<T>): VectorSortedSet<T>;
    difference(b: VectorSortedSet<T>): VectorSortedSet<T>;
    reduce<R>(fn: VectorSortedSetReduceFunc<R, T>, aggregator: R): R;
    mempty(): VectorSortedSet<T>;
    size(): number;
}
export declare type Node = string;
export declare type Version = number;
export declare class Id {
    node: Node;
    version: Version;
    constructor(node: Node, version: Version);
    next(): Id;
    compare(b: Id): number;
    toString(): string;
}
export declare class VectorClock2 implements Orderer<VectorClock2> {
    id: Id;
    vector: VectorSortedSet<Id>;
    constructor(id: Id, vector: VectorSortedSet<Id>);
    toString(): string;
    next(): VectorClock2;
    equal(b: VectorClock2): boolean;
    compare(b: VectorClock2): number;
    lessThan(b: VectorClock2): boolean;
    merge(b: VectorClock2): VectorClock2;
}
