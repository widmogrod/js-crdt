import {Text} from './text';
import {Insert} from './insert';
import {Delete} from './delete';

export function snapshot<T>(text: Text<T>): Text<T> {
  return text.next();
}

type Operation = Insert | Delete;

export function toArray(text: Text<Operation>): string[] {
  return text.reduce((accumulator, operations) => {
    return operations.reduce(operationToArray, accumulator);
  }, []);
}

import {ensureArrayLength} from '../utils';

interface Buffer <T>extends Array<T> {

}

export function operationToArray(data: Buffer<string>, op: Operation): Buffer<string> {
  if (op instanceof Insert) {
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, op.at);
    copy.splice(op.at, 0, ...op.value.split(''));
    return copy;
  } else {
    if (op.at < 0) return data
    let copy = data.slice(0);
    copy = ensureArrayLength(copy, op.at);
    copy.splice(op.at, op.length);
    return copy;
  }
}

export function toString(value: string[]): string {
  return value.join('');
}

export function renderString(text: Text<Operation>): string {
  return toString(toArray(text));
}
