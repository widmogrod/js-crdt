export type ReduceFunc<R, T> = (aggregator: R, item: T) => R;

export interface OrderedMapKey<T> {
  compare(b: OrderedMapKey<T>): number;
}

export interface SortedSetTuple<A, B> {
  result: A;
  value: B;
}

export interface SortedSet<T> {
  add(item: T): SortedSetTuple<SortedSet<T>, T>;
  reduce<R>(fn: ReduceFunc<R, T>, accumulator: R): R;
  size(): number;
  from(value: T, inclusive: boolean): SortedSet<T>;
  to(value: T, inclusive: boolean): SortedSet<T>;
}

export interface Map<K, V> {
  set(key: K, value: V): Map<K, V>;
  get?(key: K): V;
}

export class Indexed<T extends OrderedMapKey<T>> implements OrderedMapKey<T> {
  public value: T;
  public index: number;

  constructor(value: T, index: number) {
    this.value = value;
    this.index = index;
  }

  public compare(b: Indexed<T>): number  {
    return this.value.compare(b.value);
  }
}

export class OrderedMap<K extends OrderedMapKey<K>, V> {
  constructor(private keys?: SortedSet<Indexed<K>>, private values?: Map<number, V>) {}

  public set(key: K, value: V): OrderedMap<K, V> {
    const result = this.keys.add(new Indexed(key, this.keys.size()));

    return new OrderedMap(
      result.result,
      this.values.set(result.value.index, value),
    );
  }

  public get?(key: K): V {
    const result = this.keys.add(new Indexed(key, this.keys.size()));
    if (result.result !== this.keys) {
      return null;
    }

    return this.values.get(result.value.index);
  }

  public merge(b: OrderedMap<K, V>): OrderedMap<K, V> {
    return b.reduce((aggregator: OrderedMap<K, V>, item: V, key: K) => {
      return aggregator.set(key, item);
    }, this);
  }

  public reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R {
    return this.keys.reduce((aggregator, key) => {
      return fn(aggregator, this.values.get(key.index), key.value);
    }, aggregator);
  }

  public from(key: K, inclusive: boolean = true): OrderedMap<K, V> {
    const result = this.keys.add(new Indexed(key, this.keys.size()));

    return new OrderedMap(
      this.keys.from(result.value, inclusive),
      this.values, // TODO Pass all values since those are immutable...
    );
  }

  public to(key: K, inclusive: boolean = true): OrderedMap<K, V> {
    const result = this.keys.add(new Indexed(key, this.keys.size()));

    return new OrderedMap(
      this.keys.to(result.value, inclusive),
      this.values, // TODO Pass all values since those are immutable...
    );
  }
}
