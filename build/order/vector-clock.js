"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Id {
    constructor(node, version) {
        this.node = node;
        this.version = version;
        this.node = node;
        this.version = version;
    }
    next() {
        return new Id(this.node, this.version + 1);
    }
    compare(b) {
        return this.node.localeCompare(b.node);
    }
    toString() {
        return `Id(${this.node},${this.version})`;
    }
}
exports.Id = Id;
class VectorClock {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        this.id = id;
        /* tslint:disable: prefer-const */
        let { result, value } = vector.add(id);
        if (result === vector) {
            if (id.version > value.version) {
                result = vector.remove(value).result.add(id).result;
            }
        }
        this.vector = result;
    }
    toString() {
        const a = this.vector.reduce((r, i) => r + i.toString(), "");
        return `VectorClock(${this.id},${a})`;
    }
    next() {
        return new VectorClock(this.id.next(), this.vector.remove(this.id).result.add(this.id.next()).result);
    }
    equal(b) {
        if (this.vector.size() !== b.vector.size()) {
            return false;
        }
        return this.vector.reduce((eq, item) => {
            if (eq) {
                const { result, value } = b.vector.add(item);
                if (result === b.vector) {
                    return value.version === item.version;
                }
            }
            return false;
        }, true);
    }
    compare(b) {
        if (this.lessThan(b)) {
            return -1;
        }
        if (b.lessThan(this)) {
            return 1;
        }
        if (this.equal(b)) {
            return 0;
        }
        // then it's councurent
        // right now I don't have such compare option
        // so tie braking approach is to compare ID's
        return this.id.compare(b.id);
    }
    lessThan(b) {
        // VC(a) < VC(b) IF
        //   forall VC(a)[i] <= VC(b)[i]
        //   and exists VC(a)[i] < VC(b)[i]]
        const { everyLEQ, anyLT } = this.vector
            .intersect(b.vector)
            .reduce(({ everyLEQ, anyLT }, item) => {
            const rA = this.vector.add(item).value;
            const rB = b.vector.add(item).value;
            anyLT = anyLT ? anyLT : rA.version < rB.version;
            everyLEQ = everyLEQ ? rA.version <= rB.version : everyLEQ;
            return { everyLEQ, anyLT };
        }, {
            anyLT: false,
            everyLEQ: true,
        });
        return everyLEQ && (anyLT || (this.vector.size() < b.vector.size()));
    }
    merge(b) {
        const vector = this.vector.reduce((vector, item) => {
            const { result, value } = b.vector.add(item);
            if (result === b.vector) {
                if (value.version > item.version) {
                    return vector.add(value).result;
                }
                else {
                    return vector.add(item).result;
                }
            }
            return vector.add(item).result;
        }, this.vector.mempty());
        return new VectorClock(this.id, vector.union(b.vector));
    }
}
exports.VectorClock = VectorClock;
//# sourceMappingURL=vector-clock.js.map