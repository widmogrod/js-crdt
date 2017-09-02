export type ReduceFunc<R,T> = (aggregator: R, item: T) => R

export class NaiveArrayList<T> {
  array: T[]
  constructor(array?: T[]) {
    this.array = array || [];
  }

  insert(at: number, item: T): NaiveArrayList<T> {
    const clone = this.array.slice(0);
    clone.splice(at, 0, item);
    return new NaiveArrayList(clone);
  }

  remove(at: number): NaiveArrayList<T> {
    const clone = this.array.slice(0);
    clone.splice(at, 1);
    return new NaiveArrayList(clone);
  }

  get?(at: number): T {
    return this.array[at];
  }

  size(): number {
    return this.array.length;
  }

  reduce<R>(fn: ReduceFunc<R,T>, aggregator: R): R {
    return this.array.reduce(fn, aggregator);
  }

  mempty(): NaiveArrayList<T> {
    return new NaiveArrayList()
  }
}
