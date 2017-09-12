import {VectorClock2, Id, Node, Version, VectorSortedSet} from './vector-clock2';
import {SortedSetArray} from '../structures/sorted-set-array';
import {NaiveArrayList} from '../structures/naive-array-list';

const emptyVector = new SortedSetArray(new NaiveArrayList([]));

export function createVectorClock2(id: Node, version?: Version, vector?: VectorSortedSet<Id>): VectorClock2 {
  return new VectorClock2(
    new Id(id, version ? version : 0),
   vector ? vector : emptyVector
  );
}


