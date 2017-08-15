import {Orderer} from './orderer'
import {clone, union, common, diff} from '../utils'

type Key = string
type Vector = { [id: string]: number }

export class VectorClock implements Orderer<VectorClock>{
  constructor(public id: Key, public vector: Vector) {
    vector = clone(vector);
    vector[id] = vector[id] || 0;

    this.id = id;
    this.vector = vector;
  }

  next(): VectorClock {
    const vector = clone(this.vector);

    ++vector[this.id];

    return new VectorClock(this.id, vector);
  }

  merge(b: VectorClock): VectorClock {
    const vector = union(
      Object.keys(this.vector),
      Object.keys(b.vector)
    ).reduce((vector, key) => {
      vector[key] = Math.max(
        this.vector[key] || 0,
        b.vector[key] || 0
      );

      return vector;
    }, {});

    return new VectorClock(this.id, vector);
  }

  equal(b: VectorClock): boolean {
    return this.compare(b) === 0;
  }

  compare(b: VectorClock): number {
    const position = common(this.vector, b.vector)
      .reduce((result, key: any) => {
        return result + (this.vector[key] - b.vector[key]);
      }, 0);

    if (position !== 0) {
      return position;
    }

    const difA = diff(this.vector, b.vector).length;
    const difB = diff(b.vector, this.vector).length;

    const dif = difA - difB;
    if (dif !== 0) {
      return dif;
    }

    const tipPosition = this.vector[this.id] - b.vector[b.id];
    if (tipPosition !== 0) {
      return tipPosition;
    }

    const ha = b.vector.hasOwnProperty(this.id);
    const hb = this.vector.hasOwnProperty(b.id);

    if (!ha && !hb) {
      return this.id < b.id ? -1 : 1;
    } else if (ha && !hb) {
      return -1;
    } else if (hb && !ha) {
      return 1;
    }

    return 0;
  }
}
