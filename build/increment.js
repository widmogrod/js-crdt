"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Increment {
    constructor(value) {
        this.value = value;
        this.value = value;
    }
    merge(b) {
        return new Increment(Math.max(this.value, b.value));
    }
    equal(b) {
        return this.value === b.value;
    }
    increment() {
        return new Increment(this.value + 1);
    }
}
exports.Increment = Increment;
//# sourceMappingURL=increment.js.map