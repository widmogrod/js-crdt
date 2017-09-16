export interface Set<T> {
  equal(b: Set<T>): boolean;
  union(b: Set<T>): Set<T>;
  intersect(b: Set<T>): Set<T>;
  difference(b: Set<T>): Set<T>;
}

export type AssertFunc = (assertion: boolean, message: string) => void;

function equal<T>(a: Set<T>, b: Set<T>): boolean {
  return a.equal(b);
}

function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  return a.union(b);
}

function intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
  return a.intersect(b);
}

function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
  return a.difference(b);
}

export function axioms<T>(assert: AssertFunc, a: Set<T>, b: Set<T>, c: Set<T>) {
  assert(
    equal(
      union(union(a, b), c),
      union(a, union(b, c)),
    ),
    "associative union",
  );

  assert(
    equal(
      intersect(intersect(a, b), c),
      intersect(a, intersect(b, c)),
    ),
    "associative intersect",
  );

  assert(
    equal(
      union(a, intersect(b, c)),
      union(intersect(a, b), intersect(a, c)),
    ),
    "union distributes over intersection",
  );

  assert(
    equal(
      intersect(a, union(b, c)),
      intersect(union(a, b), union(a, c)),
    ),
    "intersection distributes over union",
  );

  assert(
    equal(
      difference(a, union(b, c)),
      intersect(difference(a, b), difference(a, c)),
    ),
    "De Morgan's law for union",
  );

  assert(
    equal(
      difference(a, intersect(b, c)),
      union(difference(a, b), difference(a, c)),
    ),
    "De Morgan's law for intersect",
  );
}
