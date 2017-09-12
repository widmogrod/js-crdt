import { VectorClock2, Id, Node, Version, VectorSortedSet } from './vector-clock2';
export declare function createVectorClock2(id: Node, version?: Version, vector?: VectorSortedSet<Id>): VectorClock2;
