export interface Merger<T> {
  merge(b: Merger<T>): T;
}

export function merge<T extends Merger<any>>(a: T, b: T): T {
  return a.merge(b);
}

export interface Equaler<T> {
  equal(b: Equaler<T>): boolean;
}

export function equal<T>(a: Equaler<T>, b: Equaler<T>): boolean {
  return a.equal(b);
}

export interface Comparer<T> {
  compare(b: Comparer<T>): number;
}

export function compare<T>(a: Comparer<T>, b: Comparer<T>): number {
  return a.compare(b);
}

export interface Concater<T> {
  concat(b: Concater<T>): Concater<T>;
}

export function concat<T>(a: Concater<T>, b: Concater<T>): Concater<T> {
  return a.concat(b);
}

export function between(value: number, min: number, max: number): boolean {
  if (value <= min) {
    return false;
  } else if (value >= max) {
    return false;
  }

  return true;
}

export interface CRDT<T> extends Merger<T>, Equaler<T> { }

export type AssertFunc = (assertion: boolean, message: string) => void;

export function axioms<T extends CRDT<any>>(assert: AssertFunc, a: T, b: T, c: T): void {
  // commutative   a + c = c + a                i.e: 1 + 2 = 2 + 1
  assert(
    equal(merge(a, b), merge(b, a)),
    "is not commutative",
  );

  // associative   a + (b + c) = (a + b) + c    i.e: 1 + (2 + 3) = (1 + 2) + 3
  assert(
    equal(merge(a, merge(b, c)), merge(merge(a, b), c)),
    "is not associative",
  );

  // idempotent    f(f(a)) = f(a)               i.e: ||a|| = |a|
  assert(
    equal(merge(a, a), a),
    "is not idempotent",
  );
}
