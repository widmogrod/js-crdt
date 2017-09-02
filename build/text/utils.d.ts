import { Text } from './text';
import { Insert } from './insert';
import { Delete } from './delete';
export declare function snapshot<T>(text: Text<T>): Text<T>;
export declare type Operation = Insert | Delete;
export declare function toArray(text: Text<Operation>): string[];
export interface Buffer<T> extends Array<T> {
}
export declare function operationToArray(data: Buffer<string>, op: Operation): Buffer<string>;
export declare function toString(value: string[]): string;
export declare function renderString(text: Text<Operation>): string;