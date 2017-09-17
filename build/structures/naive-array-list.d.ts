export declare type ListReduceFunc<R, T> = (aggregator: R, item: T) => R;
export declare class NaiveArrayList<T> {
    array: T[];
    constructor(array?: T[]);
    insert(at: number, item: T): NaiveArrayList<T>;
    remove(at: number): NaiveArrayList<T>;
    get?(at: number): T;
    size(): number;
    reduce<R>(fn: ListReduceFunc<R, T>, aggregator: R): R;
    mempty(): NaiveArrayList<T>;
    from(position: number, inclusive?: boolean): NaiveArrayList<T>;
    to(position: number, inclusive?: boolean): NaiveArrayList<T>;
}
