import {Delete} from "./delete";
import {Insert} from "./insert";
import {Text} from "./text";

export function snapshot<T>(text: Text<T>): Text<T> {
  return text.next();
}

export type Operation = Insert | Delete;

export function toArray(text: Text<Operation>): string[] {
  return text.reduce((accumulator, operations) => {
    return operations.reduce(operationToArray, accumulator);
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

export function renderString(text: Text<Operation>): string {
  return toString(toArray(text));
}
