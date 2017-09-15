import {Delete} from "./delete";
import {Insert} from "./insert";
import {OrderedOperations, Text} from "./text";

export function snapshot(text: Text): Text {
  return text.next();
}

export type Operation = Insert | Delete;

export function toArray(text: Text): string[] {
  return text.reduce((accumulator: string[], item: OrderedOperations) => {
    return item.operations.reduce(operationToArray, accumulator);
  }, []);
}

import {ensureArrayLength} from "../utils";

// TODO make it nicer
export function operationToArray(data: string[], op: Operation): string[] {
  if (op instanceof Insert) {
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, op.at);
    copy.splice(op.at, 0, ...op.value.split(""));
    return copy;
  } else {
    if (op.at < 0) {
      return data;
    }
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, op.at);
    copy.splice(op.at, op.length);
    return copy;
  }
}

export function toString(value: string[]): string {
  return value.join("");
}

export function renderString(text: Text): string {
  return toString(toArray(text));
}
