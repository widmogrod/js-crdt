"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function divide(lower, upper, elements, item, onNew, onExists) {
    const step = (upper - lower);
    if (step < 1) {
        return onNew(item, elements, lower);
    }
    const half = step / 2 | 0;
    const idx = lower + half;
    const elm = elements.get(idx);
    const cmp = elm.compare(item);
    if (cmp < 0) {
        return divide(half ? (lower + half) : upper, upper, elements, item, onNew, onExists);
    }
    if (cmp > 0) {
        return divide(lower, half ? (upper - half) : lower, elements, item, onNew, onExists);
    }
    return onExists(elm, elements);
}
class Tuple {
    constructor(result, value) {
        this.result = result;
        this.value = value;
    }
}
class SortedSetArray {
    constructor(elements) {
        this.elements = elements;
    }
    size() {
        return this.elements.size();
    }
    add(value) {
        return divide(0, this.elements.size(), this.elements, value, (value, elements, lower) => new Tuple(new SortedSetArray(elements.insert(lower, value)), value), (value, elements) => new Tuple(this, value));
    }
    has(value) {
        return divide(0, this.elements.size(), this.elements, value, () => false, () => true);
    }
    union(b) {
        return b.reduce((result, item) => {
            return result.add(item).result;
        }, this);
    }
    reduce(fn, accumulator) {
        return this.elements.reduce(fn, accumulator);
    }
}
exports.SortedSetArray = SortedSetArray;
//# sourceMappingURL=sorted-set-array.js.map