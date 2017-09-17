export declare type SetReduceFunc<R, T> = (aggregator: R, item: T) => R;
export interface List<T> {
    insert(at: number, item: T): List<T>;
    remove(at: number): List<T>;
    get?(at: number): T;
    size(): number;
    reduce<R>(fn: SetReduceFunc<R, T>, aggregator: R): R;
    mempty(): List<T>;
    from(position: number, inclusive: boolean): List<T>;
    to(position: number, inclusive: boolean): List<T>;
}
export interface Item<T> {
    compare(b: Item<T>): number;
}
export declare function divide<T extends Item<T>, R>(lower: number, upper: number, elements: List<T>, item: T, onNew: (item: T, elements: List<T>, lower: number) => R, onExists: (item: T, elements: List<T>, index: number) => R): R;
export declare class Tuple<A, B> {
    result: A;
    value: B;
    constructor(result: A, value: B);
}
export declare class SortedSetArray<T extends Item<T>> {
    elements: List<T>;
    constructor(elements: List<T>);
    mempty(): SortedSetArray<T>;
    size(): number;
    add(value: T): Tuple<SortedSetArray<T>, T>;
    remove(value: T): Tuple<SortedSetArray<T>, T>;
    has(value: T): boolean;
    union(b: SortedSetArray<T>): SortedSetArray<T>;
    intersect(b: SortedSetArray<T>): SortedSetArray<T>;
    difference(b: SortedSetArray<T>): SortedSetArray<T>;
    equal(b: SortedSetArray<T>): boolean;
    reduce<R>(fn: SetReduceFunc<R, T>, accumulator: R): R;
    from(value: T, inclusive?: boolean): SortedSetArray<T>;
    to(value: T, inclusive?: boolean): SortedSetArray<T>;
}
