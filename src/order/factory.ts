import {NaiveArrayList} from "../structures/naive-array-list";
import {SortedSetArray} from "../structures/sorted-set-array";
import {Id, Node, VectorClock, VectorSortedSet, Version} from "./vector-clock";

const emptyVector = new SortedSetArray(new NaiveArrayList([]));

export function createVectorClock(id: Node, version?: Version, vector?: VectorSortedSet<Id>): VectorClock {
  return new VectorClock(
    new Id(id, version ? version : 0),
   vector ? vector : emptyVector,
  );
}
