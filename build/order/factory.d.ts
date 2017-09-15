import { Id, Node, VectorClock2, VectorSortedSet, Version } from "./vector-clock2";
export declare function createVectorClock2(id: Node, version?: Version, vector?: VectorSortedSet<Id>): VectorClock2;
