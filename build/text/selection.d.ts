export declare class Selection {
    origin: string;
    at: number;
    length: number;
    endsAt: number;
    constructor(origin: string, at: number, length: number);
    hasSameOrgin(b: Selection): boolean;
    moveRightBy(step: number): Selection;
    expandBy(length: number): Selection;
    isInside(position: number): boolean;
}
