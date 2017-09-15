import { CRDT } from "./functions";
export declare class Increment implements CRDT<Increment> {
    value: number;
    constructor(value: number);
    merge(b: Increment): Increment;
    equal(b: Increment): boolean;
    increment(): Increment;
}
