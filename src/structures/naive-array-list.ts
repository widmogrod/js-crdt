export type ListReduceFunc<R, T> = (aggregator: R, item: T) => R;

export class NaiveArrayList<T> {
  public array: T[];
  constructor(array?: T[]) {
    this.array = array || [];
  }

  public insert(at: number, item: T): NaiveArrayList<T> {
    const clone = this.array.slice(0);
    clone.splice(at, 0, item);
    return new NaiveArrayList(clone);
  }

  public remove(at: number): NaiveArrayList<T> {
    const clone = this.array.slice(0);
    clone.splice(at, 1);
    return new NaiveArrayList(clone);
  }

  public get?(at: number): T {
    return this.array[at];
  }

  public size(): number {
    return this.array.length;
  }

  public reduce<R>(fn: ListReduceFunc<R, T>, aggregator: R): R {
    return this.array.reduce(fn, aggregator);
  }

  public mempty(): NaiveArrayList<T> {
    return new NaiveArrayList();
  }

  public from(position: number, inclusive: boolean = true): NaiveArrayList<T> {
    const clone = this.array.slice(inclusive ? position : position + 1);
    return new NaiveArrayList(clone);
  }

  public to(position: number, inclusive: boolean = true): NaiveArrayList<T> {
    const clone = this.array.slice(0, inclusive ? position + 1 : position);
    return new NaiveArrayList(clone);
  }
}
