"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class VectorClock {
    constructor(id, vector) {
        this.id = id;
        this.vector = vector;
        vector = utils_1.clone(vector);
        vector[id] = vector[id] || 0;
        this.id = id;
        this.vector = vector;
    }
    next() {
        const vector = utils_1.clone(this.vector);
        ++vector[this.id];
        return new VectorClock(this.id, vector);
    }
    merge(b) {
        const vector = utils_1.union(Object.keys(this.vector), Object.keys(b.vector)).reduce((vector, key) => {
            vector[key] = Math.max(this.vector[key] || 0, b.vector[key] || 0);
            return vector;
        }, {});
        return new VectorClock(this.id, vector);
    }
    equal(b) {
        return this.compare(b) === 0;
    }
    compare(b) {
        const position = utils_1.common(this.vector, b.vector)
            .reduce((result, key) => {
            return result + (this.vector[key] - b.vector[key]);
        }, 0);
        if (position !== 0) {
            return position;
        }
        const difA = utils_1.diff(this.vector, b.vector).length;
        const difB = utils_1.diff(b.vector, this.vector).length;
        const dif = difA - difB;
        if (dif !== 0) {
            return dif;
        }
        const tipPosition = this.vector[this.id] - b.vector[b.id];
        if (tipPosition !== 0) {
            return tipPosition;
        }
        const ha = b.vector.hasOwnProperty(this.id);
        const hb = this.vector.hasOwnProperty(b.id);
        if (!ha && !hb) {
            return this.id < b.id ? -1 : 1;
        }
        else if (ha && !hb) {
            return -1;
        }
        else if (hb && !ha) {
            return 1;
        }
        return 0;
    }
}
exports.VectorClock = VectorClock;
//# sourceMappingURL=vector-clock.js.map