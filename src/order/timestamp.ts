import {Orderer} from './orderer'

export type Bucket = string
export type Time = number

export class Timestamp implements Orderer<Timestamp> {
  constructor(public bucket: Bucket, public time: Time) {
    this.bucket = bucket;
    this.time = time;
  }

  next(): Timestamp {
    return new Timestamp(this.bucket, this.time + 1);
  }

  compare(b: Timestamp): number {
    if (this.bucket === b.bucket) {
      return this.time - b.time;
    }

    return this.bucket < b.bucket ? -1 : 1;
  }

  merge(b: Timestamp): Timestamp {
    return this;
  }

  equal(b: Timestamp): boolean {
    return false;
  }
}
