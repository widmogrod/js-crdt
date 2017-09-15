import {NaiveArrayList} from "../structures/naive-array-list";
import {NaiveImmutableMap} from "../structures/naive-immutable-map";
import {Indexed, OrderedMap} from "../structures/ordered-map";
import {SortedSetArray} from "../structures/sorted-set-array";
import {Orderer} from "./orderer";
import {Text} from "./text";

export function createFromOrderer(order: Orderer<any>): Text {
  return new Text(
    order,
    new OrderedMap(
      new SortedSetArray(new NaiveArrayList([])),
      new NaiveImmutableMap(),
    ),
  );
}
