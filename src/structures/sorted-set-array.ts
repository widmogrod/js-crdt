export type SetReduceFunc<R, T> = (aggregator: R, item: T) => R;

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

export function divide<T extends Item<T>, R>(
  lower: number,
  upper: number,
  elements: List<T>,
  item: T,
  onNew: (item: T, elements: List<T>, lower: number) => R,
  onExists: (item: T, elements: List<T>, index: number) => R,
): R {
  const step = (upper - lower);
  if (step < 1) {
    return onNew(item, elements, lower);
  }

  const half = Math.trunc(step / 2);
  const idx = lower + half;
  const elm = elements.get(idx);
  const cmp = elm.compare(item);

  if (cmp < 0) {
    return divide(half ? (lower + half) : upper, upper, elements, item, onNew, onExists);
  }

  if (cmp > 0) {
    return divide(lower, half ? (upper - half) : lower, elements, item, onNew, onExists);
  }

  return onExists(elm, elements, idx);
}

export class Tuple<A, B> {
  constructor(public result: A, public value: B) {}
}

export class SortedSetArray<T extends Item<T>> {
  public elements: List<T>;

  constructor(elements: List<T>) {
    this.elements = elements;
  }

  public mempty(): SortedSetArray<T> {
    return new SortedSetArray(this.elements.mempty());
  }

  public size(): number {
    return this.elements.size();
  }

  public add(value: T): Tuple<SortedSetArray<T>, T> {
    return divide(
      0, this.elements.size(), this.elements, value,
      (item, elements, lower) => new Tuple(new SortedSetArray(elements.insert(lower, item)), item),
      (item, elements) => new Tuple(this, item),
    );
  }

  public remove(value: T): Tuple<SortedSetArray<T>, T> {
    return divide(
      0, this.elements.size(), this.elements, value,
      (item, elements, lower) => new Tuple(this, value),
      (item, elements, index) => new Tuple(new SortedSetArray(elements.remove(index)), item),
    );
  }

  public has(value: T): boolean {
    return divide(
      0, this.elements.size(), this.elements, value,
      () => false,
      () => true,
    );
  }

  public union(b: SortedSetArray<T>): SortedSetArray<T> {
    return b.reduce((result: SortedSetArray<T>, item: T): SortedSetArray<T> => {
      return result.add(item).result;
    }, this);
  }

  public intersect(b: SortedSetArray<T>): SortedSetArray<T> {
    return this.reduce((result: SortedSetArray<T>, item: T): SortedSetArray<T> => {
      return b.has(item) ? result.add(item).result : result;
    }, this.mempty());
  }

  public difference(b: SortedSetArray<T>): SortedSetArray<T> {
    return this.reduce((result: SortedSetArray<T>, item: T): SortedSetArray<T> => {
      return b.has(item) ? result : result.add(item).result;
    }, this.mempty());
  }

  public equal(b: SortedSetArray<T>): boolean {
    if (this.size() !== b.size()) {
      return false;
    }

    // TODO reduce is not optimal, because it iterates till the end of set
    return b.reduce((equal: boolean, item: T): boolean => {
      return equal ? this.has(item) : equal;
    }, true);
  }

  public reduce<R>(fn: SetReduceFunc<R, T>, accumulator: R): R {
    return this.elements.reduce(fn, accumulator);
  }

  public from(value: T, inclusive: boolean = true): SortedSetArray<T> {
    return divide(
      0, this.elements.size(), this.elements, value,
      (item, elements, lower) => new SortedSetArray(this.elements.from(lower, inclusive)),
      (item, elements, index) => new SortedSetArray(this.elements.from(index, inclusive)),
    );
  }

  public to(value: T, inclusive: boolean = true): SortedSetArray<T> {
    return divide(
      0, this.elements.size(), this.elements, value,
      (item, elements, lower) => new SortedSetArray(this.elements.to(lower, inclusive)),
      (item, elements, index) => new SortedSetArray(this.elements.to(index, inclusive)),
    );
  }
}
