"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayList {
    constructor(array) {
        this.array = array || [];
    }
    insert(at, item) {
        const clone = this.array.slice(0);
        clone.splice(at, 0, item);
        return new ArrayList(clone);
    }
    get(at) {
        return this.array[at];
    }
    size() {
        return this.array.length;
    }
    reduce(fn, aggregator) {
        return this.array.reduce(fn, aggregator);
    }
}
exports.ArrayList = ArrayList;
//# sourceMappingURL=array-list.js.map