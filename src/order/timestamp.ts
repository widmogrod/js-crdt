import {Orderer} from './domain'

export type Bucket = string
export type Time = number

export class Timestamp implements Orderer<Timestamp> {
    bucket: Bucket
    time: Time
    constructor(bucket, time) {
        this.bucket = bucket;
        this.time = time;
    }s

    compare(b: Timestamp): number {
        if (this.bucket === b.bucket) {
            return this.time - b.time;
        }

        return this.bucket < b.bucket ? -1 : 1;
    }
    
    merge(b: Timestamp): Timestamp {
        return this;
    }
    
    equal(b: Timestamp): Boolean {
        return false;
    }
}
