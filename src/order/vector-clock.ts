import {Orderer} from "./orderer";

export type VectorSortedSetReduceFunc<R, T> = (aggregator: R, item: T) => R;

export interface VectorSortedSetTuple<A, B> {
  result: A;
  value: B;
}

export interface VectorSortedSet<T> {
  add(item: T): VectorSortedSetTuple<VectorSortedSet<T>, T>;
  remove(item: T): VectorSortedSetTuple<VectorSortedSet<T>, T>;
  union(b: VectorSortedSet<T>): VectorSortedSet<T>;
  intersect(b: VectorSortedSet<T>): VectorSortedSet<T>;
  difference(b: VectorSortedSet<T>): VectorSortedSet<T>;
  reduce<R>(fn: VectorSortedSetReduceFunc<R, T>, aggregator: R): R;
  mempty(): VectorSortedSet<T>;
  size(): number;
}

export type Node = string;
export type Version = number;

export class Id {
  constructor(public node: Node, public version: Version) {
    this.node = node;
    this.version = version;
  }

  public next(): Id {
    return new Id(
      this.node,
      this.version + 1,
    );
  }

  public compare(b: Id): number {
    return this.node.localeCompare(b.node);
  }

  public toString(): string {
    return `Id(${this.node},${this.version})`;
  }
}

export class VectorClock implements Orderer<VectorClock> {
  constructor(public id: Id, public vector: VectorSortedSet<Id>) {
    this.id = id;
    /* tslint:disable: prefer-const */
    let {result, value} = vector.add(id);

    if (result === vector) {
      if (id.version > value.version) {
        result = vector.remove(value).result.add(id).result;
      }
    }

    this.vector = result;
  }

  public toString(): string {
    const a = this.vector.reduce((r, i) => r + i.toString(), "");
    return `VectorClock(${this.id},${a})`;
  }

  public next(): VectorClock {
    return new VectorClock(
      this.id.next(),
      this.vector.remove(this.id).result.add(this.id.next()).result,
    );
  }

  public equal(b: VectorClock): boolean {
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

  public compare(b: VectorClock): number {
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

  public lessThan(b: VectorClock): boolean {
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

        return {everyLEQ, anyLT};
      }, {
        anyLT: false,
        everyLEQ: true,
      });

    return everyLEQ && (anyLT || (this.vector.size() < b.vector.size()));
  }

  public merge(b: VectorClock): VectorClock {
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

    return new VectorClock(
      this.id,
      vector.union(b.vector),
    );
  }
}
