import { Selection } from "./selection";
import { Operation } from "./operation";
import { Text } from "./text";
export declare function snapshot(text: Text): Text;
export declare function toArray(text: Text): string[];
export declare function ensureArrayLength<T>(array: T[], len: number): T[];
export declare function operationToArray(data: string[], op: Operation): string[];
export declare function toString(value: string[]): string;
export declare function renderString(text: Text): string;
export declare function getSelection(text: Text, fallback: Selection): Selection;
export interface SelectionMap<K, V> {
    set(key: K, value: V): SelectionMap<K, V>;
    get?(key: K): V;
    reduce<R>(fn: (aggregator: R, values: V, key: K) => R, aggregator: R): R;
}
export declare function getSelections(text: Text, fallback: Selection): SelectionMap<string, Selection>;
export declare function selectionUpdate(selection: Selection, op: Operation): Selection;
