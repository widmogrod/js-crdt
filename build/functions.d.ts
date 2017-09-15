export interface Merger<T> {
    merge(b: Merger<T>): T;
}
export declare function merge<T extends Merger<any>>(a: T, b: T): T;
export interface Equaler<T> {
    equal(b: Equaler<T>): boolean;
}
export declare function equal<T>(a: Equaler<T>, b: Equaler<T>): boolean;
export interface Comparer<T> {
    compare(b: Comparer<T>): number;
}
export declare function compare<T>(a: Comparer<T>, b: Comparer<T>): number;
export interface Concater<T> {
    concat(b: Concater<T>): Concater<T>;
}
export declare function concat<T>(a: Concater<T>, b: Concater<T>): Concater<T>;
export interface CRDT<T> extends Merger<T>, Equaler<T> {
}
export declare type AssertFunc = (assertion: boolean, message: string) => void;
export declare function axioms<T extends CRDT<any>>(assert: AssertFunc, a: T, b: T, c: T): void;
