export interface Set<T> {
    equal(b: Set<T>): boolean;
    union(b: Set<T>): Set<T>;
    intersect(b: Set<T>): Set<T>;
    difference(b: Set<T>): Set<T>;
}
export declare type AssertFunc = (boolean, string) => void;
export declare function axioms<T>(assert: AssertFunc, a: Set<T>, b: Set<T>, c: Set<T>): void;
