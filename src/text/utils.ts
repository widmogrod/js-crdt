import {Delete} from "./delete";
import {Insert} from "./insert";
import {Selection} from "./selection";
import {Operation} from "./operation";
import {OrderedOperations, Text} from "./text";

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
  return value.join("");
}

export function renderString(text: Text): string {
  return toString(toArray(text));
}

export function selectionFunc(text: Text, fallback: Selection): Selection {
  return text.reduce((accumulator: Selection, item: OrderedOperations): Selection => {
    return item.operations.reduce<Selection>((selection: Selection, op: Operation): Selection => {
      if (op instanceof Selection) {
        if (op.hasSameOrgin(selection)) {
          return op;
        }

        return selection;
      }

      if (op instanceof Insert) {
        if (op.at <= selection.at) {
          return selection
            .moveRightBy(op.length);
        } else if (selection.isInside(op.at)) {
          return selection
            .expandBy(op.length);
        }

        return selection;
      }

      if (op instanceof Delete) {
        if (op.at <= selection.at) {
          if (selection.isInside(op.endsAt)) {
            return selection
              .moveRightBy(op.at - selection.at)
              .expandBy(selection.at - op.endsAt);
          } else {
            return selection
              .moveRightBy(-op.length);
          }
        } else if (selection.isInside(op.at)) {
            return selection
              .expandBy(-op.length);
        }

        return selection;
      }

      return selection;
    }, accumulator);
  }, fallback);
}
