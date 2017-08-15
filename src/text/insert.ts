export class Insert {
  constructor(public at: number, public value: string) {
    this.at = at < 0 ? 0 : at;
    this.value = String(value);
  }
}
