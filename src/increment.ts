import {CRDT} from './functions'

export class Increment implements CRDT<Increment> {
  value: number
  constructor(value: number) {
    this.value = value;
  }
  merge(b: Increment) {
    return new Increment(Math.max(this.value, b.value));
  }
  equal(b: Increment) {
    return this.value === b.value;
  }
  increment() {
    return new Increment(this.value + 1);
  }
}
