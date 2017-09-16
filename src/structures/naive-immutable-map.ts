export type Key = string | number;

export class NaiveImmutableMap<V> {
  constructor(private data?: any) {
    this.data = data || {};
  }

  public set(key: Key, value: V): NaiveImmutableMap<V> {
    const clone = Object
    .keys(this.data)
    .reduce((clone, k: Key) => {
      clone[k] = this.data[k];
      return clone;
    }, {});

    clone[key] = value;

    return new NaiveImmutableMap(clone);
  }

  public get?(key: Key): V {
    return this.data[key];
  }

  public reduce<R>(fn: (aggregator: R, values: V, key: string) => R, aggregator: R): R {
    return Object.keys(this.data).reduce((aggregator: R, key: string) => {
      return fn(aggregator, this.data[key], key);
    }, aggregator);
  }
}
