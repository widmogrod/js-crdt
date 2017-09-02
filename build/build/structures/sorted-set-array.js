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
    return onExists(elm, elements, idx);
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
    mempty() {
        return new SortedSetArray(this.elements.mempty());
    }
    size() {
        return this.elements.size();
    }
    add(value) {
        return divide(0, this.elements.size(), this.elements, value, (item, elements, lower) => new Tuple(new SortedSetArray(elements.insert(lower, item)), item), (item, elements) => new Tuple(this, item));
    }
    remove(value) {
        return divide(0, this.elements.size(), this.elements, value, (item, elements, lower) => new Tuple(this, value), (item, elements, index) => new Tuple(new SortedSetArray(elements.remove(index)), item));
    }
    has(value) {
        return divide(0, this.elements.size(), this.elements, value, () => false, () => true);
    }
    union(b) {
        return b.reduce((result, item) => {
            return result.add(item).result;
        }, this);
    }
    intersect(b) {
        return this.reduce((result, item) => {
            return b.has(item) ? result.add(item).result : result;
        }, this.mempty());
    }
    difference(b) {
        return this.reduce((result, item) => {
            return b.has(item) ? result : result.add(item).result;
        }, this.mempty());
    }
    equal(b) {
        if (this.size() != b.size()) {
            return false;
        }
        // TODO reduce is not optimal, because it iterates till the end of set
        return b.reduce((equal, item) => {
            return equal ? this.has(item) : equal;
        }, true);
    }
    reduce(fn, accumulator) {
        return this.elements.reduce(fn, accumulator);
    }
}
exports.SortedSetArray = SortedSetArray;
//# sourceMappingURL=sorted-set-array.js.map