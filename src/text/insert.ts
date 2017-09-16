export class Insert {
  public length: number;
  public endsAt: number;
  constructor(public at: number, public value: string) {
    this.at = at < 0 ? 0 : at;
    this.value = String(value);
    this.length = this.value.length;
    this.endsAt = this.at + this.length;
  }
}
