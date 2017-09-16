import {CRDT} from "./functions";

export class Increment implements CRDT<Increment> {
  constructor(public value: number) {
    this.value = value;
  }
  public merge(b: Increment) {
    return new Increment(Math.max(this.value, b.value));
  }
  public equal(b: Increment) {
    return this.value === b.value;
  }
  public increment() {
    return new Increment(this.value + 1);
  }
}
