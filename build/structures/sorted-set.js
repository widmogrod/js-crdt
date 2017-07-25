"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions");
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
class SortedSet {
    constructor() {
        this.elements = [];
    }
    add(value) {
        let index = this.elements.findIndex(({ item }) => {
            return item.equal(value);
        });
        if (-1 === index) {
            index = this.elements.length;
            this.elements.push({ item: value, index });
            this.elements.sort((a, b) => functions_1.compare(a.item, b.item));
        }
        return index;
    }
    index(idx) {
        const item = this.elements.find(({ index }) => index === idx);
        if (item) {
            return item.item;
        }
    }
    reduce(fn, accumulator) {
        return this.elements.reduce((accumulator, { item, index }) => {
            return fn(accumulator, item, index);
        }, accumulator);
    }
}
exports.SortedSet = SortedSet;
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
exports.Indexed = Indexed;
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
//# sourceMappingURL=sorted-set.js.map