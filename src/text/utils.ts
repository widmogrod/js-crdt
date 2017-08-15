import {Text} from './text';
import {Insert} from './insert';
import {Delete} from './delete';

export function snapshot<T>(text: Text<T>): Text<T> {
  return text.next();
}

type Operation = Insert | Delete;

export function toArray(text: Text<Operation>): string[] {
  return text.reduce((accumulator, operations) => {
    return operations.reduce((accumulator, operation) => {
      return operation.apply(accumulator);
    }, accumulator);
  }, []);
}

export function toString(value: string[]): string {
  return value.join('');
}

export function renderString(text: Text<Operation>): string {
  return toString(toArray(text));
}
