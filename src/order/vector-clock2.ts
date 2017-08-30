import {Orderer} from './orderer'

type ReduceFunc<R,T> = (aggregator: R, item: T) => R

interface Tuple<A,B> {
  result: A
  value: B
}

interface SortedSet<T> {
  add(item: T): Tuple<SortedSet<T>,T>
  remove(item: T): Tuple<SortedSet<T>,T>
  union(b: SortedSet<T>): SortedSet<T>
  intersect(b: SortedSet<T>): SortedSet<T>
  difference(b: SortedSet<T>): SortedSet<T>
  reduce<R>(fn: ReduceFunc<R,T>, aggregator: R): R
  mempty(): SortedSet<T>
  size(): number
}

type Key = string
type Version = number;

export class Id {
  constructor(public key: Key, public version: Version) {
    this.key = key;
    this.version = version;
  }

  next(): Id {
    return new Id(
      this.key,
      this.version + 1
    );
  }

  compare(b: Id): number {
    return this.key.localeCompare(b.key);
  }

  toString(): string {
    return `Id(${this.key},${this.version})`
  }
}

export class VectorClock2 implements Orderer<VectorClock2>{
  constructor(public id: Id, public vector: SortedSet<Id>) {
    this.id = id;
    let {result, value} = vector.add(id);

    if (result === vector) {
      if (id.version > value.version) {
        result = vector.remove(value).result.add(id).result;
      }
    }

    this.vector = result;
  }

  toString(): string {
    const a = this.vector.reduce((r, i) => r + i.toString(), '')
    return `VectorClock2(${this.id},${a})`;
  }

  next(): VectorClock2 {
    return new VectorClock2(
      this.id.next(),
      this.vector.remove(this.id).result.add(this.id.next()).result
    );
  }

  equal(b: VectorClock2): boolean {
    if (this.vector.size() !== b.vector.size()) {
      return false;
    }

    return this.vector.reduce((eq, item) => {
      if (eq) {
        const {result, value} = b.vector.add(item);
        if (result === b.vector) {
          return value.version === item.version;
        }
      }

      return false;
    }, true);
  }

  compare(b: VectorClock2): number {
    if (this.lessThan(b)) {
      return -1;
    }

    if (b.lessThan(this)) {
      return 1;
    }

    if (this.equal(b)) {
      return 0;
    }

    // then it's councurent
    // right now I don't have such compare option
    // so tie braking approach is to compare ID's
    return this.id.compare(b.id);
  }

  lessThan(b: VectorClock2): boolean {
    // VC(a) < VC(b) IF
    //   forall VC(a)[i] <= VC(b)[i]
    //   and exists VC(a)[i] < VC(b)[i]]
    const {everyLEQ, anyLT} = this.vector
      .intersect(b.vector)
      .reduce(({everyLEQ, anyLT}, item) => {
        const rA = this.vector.add(item).value;
        const rB = b.vector.add(item).value;

        anyLT = anyLT ? anyLT : rA.version < rB.version;
        everyLEQ = everyLEQ ? rA.version <= rB.version : everyLEQ;

        return {everyLEQ, anyLT}
      }, {
        everyLEQ: true,
        anyLT: false,
      });

    return everyLEQ && (anyLT || (this.vector.size() < b.vector.size()));
  }

  merge(b: VectorClock2): VectorClock2 {
    const vector = this.vector.reduce((vector, item) => {
      const {result, value} = b.vector.add(item);
      if (result === b.vector) {
        if (value.version > item.version) {
          return vector.add(value).result;
        } else {
          return vector.add(item).result;
        }
      }

      return vector.add(item).result;
    }, this.vector.mempty());

    return new VectorClock2(
      this.id,
      vector.union(b.vector)
    );
  }
}
