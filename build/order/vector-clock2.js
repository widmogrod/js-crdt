"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// D/1 < D2 < E/3
class Dummy {
    constructor(key, version) {
        this.key = key;
        this.version = version;
        this.key = key;
        this.version = version;
    }
    next() {
        return new Dummy(this.key, this.version + 1);
    }
    compare(b) {
        return this.key.localeCompare(b.key);
    }
    toString() {
        return `D(${this.key}, ${this.version})`;
    }
}
exports.Dummy = Dummy;
class VectorClock2 {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        this.id = id;
        let { result, value } = vector.add(id);
        if (result === vector) {
            if (id.version > value.version) {
                result = vector.remove(id).result.add(id).result;
            }
        }
        this.vector = result;
    }
    toString() {
        const a = this.vector.reduce((r, i) => r + i.toString(), '');
        return `V2(${this.id},${a})`;
    }
    next() {
        return new VectorClock2(this.id.next(), this.vector.remove(this.id).result.add(this.id.next()).result);
    }
    equal(b) {
        return this.compare(b) === 0;
    }
    compare(b) {
        return this.vector
            .intersect(b.vector)
            .reduce((cmp, item) => {
            if (cmp === -1) {
                return cmp;
            }
            const rA = this.vector.add(item);
            const rB = b.vector.add(item);
            cmp = rA.value.version - rB.value.version;
            return cmp;
        }, 0);
    }
    merge(b) {
        const c = this.vector
            .union(b.vector)
            .reduce(({ result, prev }, item) => {
            if (prev) {
                if (prev.key !== item.key) {
                    result = result.add(prev).result;
                }
                else if (prev.version > item.version) {
                    item = prev;
                }
            }
            return { result, prev: item };
        }, {
            result: this.vector.mempty(),
            prev: null,
        });
        return new VectorClock2(this.id, c.result.add(c.prev).result);
    }
}
exports.VectorClock2 = VectorClock2;
//# sourceMappingURL=vector-clock2.js.map