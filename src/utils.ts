'use strict';

export function between(value: number, min: number, max: number): boolean {
    if (value <= min) {
        return false;
    } else if (value >= max) {
        return false;
    }

    return true;
}

export function ensureArrayLength<T>(array: Array<T>, len: number): Array<T> {
    if (array.length < len) {
        array.length = len;
    }

    return array;
}

export function sortNumbers(a: number, b: number): number {
    return a - b;
}

export function clone<T>(obj: T): T {
    var target = (<T>{});

    for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }

    return target;
}

function keyToMap(r: any, i: any): any {
    r[i] = true;
    return r;
};

export function union(a: any, b: any): any {
    a = a.reduce(keyToMap, {})
    b = b.reduce(keyToMap, a)
    return Object.keys(b);
}

export function common<T>(a: T, b: T): Array<T> {
    return Object.keys(a).reduce((r, k) => {
        if (b.hasOwnProperty(k)) {
            r.push(k);
        }

        return r;
    }, []).sort();
}

export function diff<T>(a: T, b:T): Array<T> {
    return Object.keys(a).reduce((r, k) => {
        if (!b.hasOwnProperty(k)) {
            r.push(k);
        }

        return r;
    }, []);
}
