export class Selection {
  public endsAt: number;
  constructor(public origin: string, public at: number, public length: number) {
    this.origin = origin;
    this.at = at < 0 ? 0 : at;
    this.length = length < 0 ? 0 : length;
    this.endsAt = this.at + this.length;
  }

  public isCursor(): boolean {
    return this.length === 0;
  }

  public hasSameOrgin(b: Selection): boolean {
    return this.origin === b.origin;
  }

  public moveRightBy(step: number): Selection {
    return new Selection(this.origin, this.at + step, this.length);
  }

  public expandBy(length: number): Selection {
    return new Selection(this.origin, this.at, this.length + length);
  }

  public isInside(position: number): boolean {
    return this.at < position && this.endsAt > position;
  }
}
