import {NaiveArrayList} from "../structures/naive-array-list";
import {SortedSetArray} from "../structures/sorted-set-array";
import {Id, Node, VectorClock2, VectorSortedSet, Version} from "./vector-clock2";

const emptyVector = new SortedSetArray(new NaiveArrayList([]));

export function createVectorClock2(id: Node, version?: Version, vector?: VectorSortedSet<Id>): VectorClock2 {
  return new VectorClock2(
    new Id(id, version ? version : 0),
   vector ? vector : emptyVector,
  );
}
