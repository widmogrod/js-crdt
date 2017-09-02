import { Orderer } from './orderer';
export declare type Key = string;
export declare type Vector = {
    [id: string]: number;
};
export declare class VectorClock implements Orderer<VectorClock> {
    id: Key;
    vector: Vector;
    constructor(id: Key, vector: Vector);
    next(): VectorClock;
    merge(b: VectorClock): VectorClock;
    equal(b: VectorClock): boolean;
    compare(b: VectorClock): number;
}
