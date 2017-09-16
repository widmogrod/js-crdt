import { Id, Node, VectorClock, VectorSortedSet, Version } from "./vector-clock";
export declare function createVectorClock(id: Node, version?: Version, vector?: VectorSortedSet<Id>): VectorClock;
