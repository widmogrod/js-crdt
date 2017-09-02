export type Key = string | number;

export class NaiveImmutableMap<V> {
  constructor(private data?: any) {
    this.data = data || {}
  }

  set(key: Key, value: V): NaiveImmutableMap<V> {
    const clone = Object
    .keys(this.data)
    .reduce((clone, k: Key) => {
      clone[k] = this.data[k];
      return clone;
    }, {});

    clone[key] = value;

    return new NaiveImmutableMap(clone);
  }

  get?(key: Key): V {
    return this.data[key];
  }
}

