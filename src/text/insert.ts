import { ensureArrayLength } from '../utils';

export class Insert {
  constructor(public at: number, public value: string) {
    this.at = at < 0 ? 0 : at;
    this.value = String(value);
  }

  apply(data) {
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, this.at);
    copy.splice(this.at, 0, ...this.value.split(''));
    return copy;
  }
}
