export class Delete {
  public endsAt: number;
  constructor(public at: number, public length: number) {
    this.at = at;
    this.length = length;
    this.endsAt = this.at + length;
  }
}
