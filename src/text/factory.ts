import {Text} from './text';
import {Orderer} from './orderer';
import {SetMap, Indexed} from '../structures/set-map';
import {NaiveImmutableMap} from '../structures/naive-immutable-map';
import {SortedSetArray} from '../structures/sorted-set-array';
import {NaiveArrayList} from '../structures/naive-array-list';

export function createFromOrderer<T>(order: Orderer<any>): Text<T> {
  return new Text(
    order,
    new SetMap(
      new SortedSetArray(new NaiveArrayList([])),
      new NaiveImmutableMap()
    )
  );
}

