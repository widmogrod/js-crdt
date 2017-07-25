// export class SetMap<K,V> {
//   keys: Set<K>
//   values: V[][]
//   constructor(keys: Set<K>, values: V[][]) {
//     this.keys = keys;
//     this.values = values;
//   }
//
//   push(key: K, value: V): this {
//     const index = this.keys.add(key)
//     this.values[index] = this.values[index] || [];
//     this.values[index].push(value);
//     return this;
//   }
//
//   set(key: K, values: V[]): this {
//     const index = this.keys.index(key);
//     this.values[index] = values;
//     return this;
//   }
//
//   get(key: K): V[] {
//     const index = this.keys.index(key);
//     return this.values[index];
//   }
//
//   merge(b: SetMap<K,V>): SetMap<K,V> {
//     return this.keys
//     .disjoin(b)
//     .reduce((aggregator: SetMap<K,V>, item: K) => {
//       return aggregator.set(item, b.get(item));
//     }, new SetMap(this.keys, this.values));
//   }
//
//   reduce<R>(fn: (aggregator: R, values: V[], key: K) => R, aggregator: R): R {
//     return this.keys.reduce((aggregator, key, index) => {
//       return fn(aggregator, this.values[index], key);
//     }, aggregator)
//   }
// }
//# sourceMappingURL=map.js.map