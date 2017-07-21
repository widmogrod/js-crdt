"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Leaf {
    constructor(value) {
        this.value = value;
    }
    get leaf() {
        return this;
    }
    get left() {
        return null;
    }
    get right() {
        return null;
    }
    find(fn) {
        if (fn(this.value)) {
            return this.value;
        }
    }
    add(item) {
        const cmp = this.value.compare(item);
        if (cmp === 0) {
            return this;
        }
        else if (cmp < 0) {
            return new Branch(new Leaf(item), this);
        }
        else if (cmp > 0) {
            return new Branch(this, null, new Leaf(item));
        }
    }
    reduce(fn, base) {
        return fn(base, this);
    }
}
class Branch {
    constructor(leaf, left, right) {
        this.leaf = leaf;
        this.left = left;
        this.right = right;
    }
    find(fn) {
        if (fn(this.leaf.value)) {
            return this.leaf.value;
        }
        if (this.left) {
            const fl = this.left.find(fn);
            if (fl)
                return fl;
        }
        if (this.right) {
            const fr = this.right.find(fn);
            if (fr)
                return fr;
        }
    }
    add(item) {
        const cmp = this.leaf.value.compare(item);
        if (cmp === 0) {
            return this;
        }
        else if (cmp < 0) {
            if (this.right) {
                return this.left
                    ? new Branch(this.leaf, this.left.add(item), this.right)
                    : new Branch(this.leaf, new Leaf(item), this.right);
            }
            else {
                return this.left
                    ? new Branch(new Leaf(item), this.left.left, this.leaf)
                    : new Branch(new Leaf(item), this.leaf, null);
            }
        }
        else if (cmp > 0) {
            if (this.left) {
                return this.right
                    ? new Branch(this.leaf, this.left, this.right.add(item))
                    : new Branch(this.leaf, this.left, new Leaf(item));
            }
            else {
                return this.right
                    ? new Branch(new Leaf(item), this.leaf, this.right.right)
                    : new Branch(new Leaf(item), null, this.leaf);
            }
        }
    }
    reduce(fn, base) {
        base = fn(base, this.leaf);
        if (this.left) {
            base = this.left.reduce(fn, base);
        }
        if (this.right) {
            base = this.right.reduce(fn, base);
        }
        return base;
    }
}
function increment(value) {
    return value + 1;
}
class Indexed {
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
    compare(b) {
        return this.value.compare(b.value);
    }
}
class SortedSetFast {
    constructor() {
        this.count = 0;
    }
    get length() {
        return this.reduce(increment, 0);
    }
    add(value) {
        const val = new Indexed(value, this.count);
        if (!this.elements) {
            this.elements = new Leaf(val);
        }
        else {
            this.elements = this.elements.add(val);
            if (this.length > this.count) {
                this.count++;
            }
        }
        val.index = this.count;
        return this.count;
    }
    index(idx) {
        return this.elements
            ? this.elements.find(({ index }) => index === idx).value
            : null;
    }
    reduce(fn, accumulator) {
        if (!this.elements) {
            return accumulator;
        }
        return this.elements.reduce((accumulator, item) => {
            return fn(accumulator, item.value, item.value.index);
        }, accumulator);
    }
}
exports.SortedSetFast = SortedSetFast;
class SortedSetArray {
    constructor() {
        this.elements = [];
    }
    add(value) {
        const val = new Indexed(value, this.elements.length);
        function divide(lower, upper, elements, item) {
            const step = (upper - lower);
            if (step < 1) {
                elements.splice(lower, 0, item);
                return item.index;
            }
            const half = step / 2 | 0;
            const idx = lower + step;
            const elm = elements[idx];
            const cmp = elm.compare(val);
            if (cmp < 0) {
                return divide(idx, upper, elements, item);
            }
            if (cmp > 0) {
                return divide(lower, idx, elements, item);
            }
            if (cmp === 0) {
                return elm.index;
            }
        }
        return divide(0, this.elements.length - 1, this.elements, val);
    }
    index(idx) {
        const r = this.elements.find(({ index }) => index === idx);
        return r ? r.value : null;
    }
    reduce(fn, accumulator) {
        return this.elements.reduce((accumulator, item) => {
            return fn(accumulator, item.value, item.index);
        }, accumulator);
    }
}
exports.SortedSetArray = SortedSetArray;
//# sourceMappingURL=sorted-set.js.map