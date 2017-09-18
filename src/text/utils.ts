import {Delete} from "./delete";
import {Insert} from "./insert";
import {Selection} from "./selection";
import {Operation} from "./operation";
import {OrderedOperations, Text} from "./text";
import {NaiveImmutableMap} from "../structures/naive-immutable-map";

export function snapshot(text: Text): Text {
  return text.next();
}

export function toArray(text: Text): string[] {
  return text.reduce((accumulator: string[], item: OrderedOperations) => {
    return item.operations.reduce(operationToArray, accumulator);
  }, []);
}

export function ensureArrayLength<T>(array: T[], len: number): T[] {
  if (array.length < len) {
    array.length = len;
  }

  return array;
}

// TODO make it nicer
export function operationToArray(data: string[], op: Operation): string[] {
  if (op instanceof Insert) {
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, op.at);
    copy.splice(op.at, 0, ...op.value.split(""));
    return copy;
  } else if (op instanceof Delete) {
    if (op.at < 0) {
      return data;
    }
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, op.at);
    copy.splice(op.at, op.length);
    return copy;
  }

  return data;
}

export function toString(value: string[]): string {
  // result.reduce skips undefined values
  // which for rendering is not good thing
  let result = "";
  for (let i = 0, len = value.length; i < len; i++) {
    const item = value[i];
    result += ((typeof item === "undefined") ? " " : item);
  }
  return result;
}

export function renderString(text: Text): string {
  return toString(toArray(text));
}

export function getSelection(text: Text, fallback: Selection): Selection {
  return text.reduce((s: Selection, oo: OrderedOperations): Selection => {
    return oo.operations.reduce<Selection>(selectionUpdate, s);
  }, fallback);
}

export interface SelectionMap<K, V> {
  set(key: K, value: V): SelectionMap<K, V>;
  get?(key: K): V;
  reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
}

export function getSelections(text: Text, fallback: Selection): SelectionMap<string, Selection> {
  return text.reduce((map: SelectionMap<string, Selection>, oo: OrderedOperations): SelectionMap<string, Selection> => {
    return oo.operations.reduce((map: SelectionMap<string, Selection>, o: Operation) => {
      return map.reduce((map: SelectionMap<string, Selection>, s: Selection, key: string) => {
        if (o instanceof Selection) {
          if (!map.get(o.origin)) {
            return map.set(o.origin, o);
          }
        }

        const next = selectionUpdate(s, o);
        return map.set(next.origin, next);
      }, map);
    }, map);
  }, new NaiveImmutableMap().set(fallback.origin, fallback));
}

export function selectionUpdate(selection: Selection, op: Operation): Selection {
  if (op instanceof Selection) {
    if (op.hasSameOrgin(selection)) {
      return op;
    }

    return selection;
  }

  if (op instanceof Insert) {
    // Don't move cursor when insert is done at the same position
    if (selection.isCursor() && op.at === selection.at) {
      return selection;
    }

    // is after selection:
    //       sssss
    //           iii
    //             iiiiii
    if (op.at >= selection.endsAt) {
      return selection;
    }

    // is before selection or on the same position:
    //       sssss
    //       iii
    // iiii
    //  iiiiii
    if (op.at <= selection.at) {
      return selection.moveRightBy(op.length);
    }

    // is inside selection:
    //       sssss
    //        i
    //           iiii
    return selection.expandBy(op.length);
  }

  if (op instanceof Delete) {
    // is before selection:
    //       ssssss
    //  ddd
    if (op.endsAt < selection.at) {
      return selection.moveRightBy(-op.length);
    }

    // is after selection:
    //       ssssss
    //               ddddd
    if (op.at > selection.endsAt) {
      return selection;
    }

    // starts inside selection block:
    //       ssssss
    //       dddddddddd
    //       ddd
    //         ddd
    //         ddddddddd
    if (op.at >= selection.at) {
      return selection.expandBy(-Math.min(selection.endsAt - op.at, op.length));
    }

    // ends inside selection:
    //       ssssss
    //     dddd
    //   dddddddd
    return selection.expandBy(selection.at - op.endsAt).moveRightBy(op.at - selection.at);
  }

  return selection;
}
