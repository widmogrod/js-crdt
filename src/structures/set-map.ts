export type ReduceFunc<R,T> = (aggregator: R, item: T) => R

export interface MapSetKey<T> {
  compare(b: MapSetKey<T>): number
}

export interface KeysTuple<A,B> {
  result: A
  value: B
}

export interface KeysSet<T> {
  add(item: T): KeysTuple<KeysSet<T>,T>
  reduce<R>(fn: ReduceFunc<R,T>, accumulator: R): R
  size(): number
}

export interface Map<K,V> {
  set(key: K, value:V): Map<K,V>
  get?(key: K): V
}

export class Indexed<T extends MapSetKey<T>> implements MapSetKey<T> {
  value: T
  index: number

  constructor(value: T, index: number) {
    this.value = value;
    this.index = index;
  }

  compare(b: Indexed<T>): number  {
    return this.value.compare(b.value);
  }
}

export class SetMap<K extends MapSetKey<K>,V> {
  constructor(private keys?: KeysSet<Indexed<K>>, private values?: Map<number, V>) {}

  set(key: K, value: V): SetMap<K,V> {
    const result = this.keys.add(new Indexed(key, this.keys.size()))

    return new SetMap(
      result.result,
      this.values.set(result.value.index, value)
    );
  }

  get?(key: K): V {
    const result = this.keys.add(new Indexed(key, this.keys.size()))
    if (result.result !== this.keys) {
      return null;
    }

    return this.values.get(result.value.index);
  }

  merge(b: SetMap<K,V>): SetMap<K,V> {
    return b.reduce((aggregator: SetMap<K,V>, item: V, key: K) => {
      return aggregator.set(key, item);
    }, this);
  }

  reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R {
    return this.keys.reduce((aggregator, key) => {
      return fn(aggregator, this.values.get(key.index), key.value);
    }, aggregator)
  }
}
