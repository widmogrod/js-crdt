import { Delete } from "./delete";
import { Insert } from "./insert";
import { Text } from "./text";
export declare function snapshot<T>(text: Text<T>): Text<T>;
export declare type Operation = Insert | Delete;
export declare function toArray(text: Text<Operation>): string[];
export declare function operationToArray(data: string[], op: Operation): string[];
export declare function toString(value: string[]): string;
export declare function renderString(text: Text<Operation>): string;
