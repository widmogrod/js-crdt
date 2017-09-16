"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Selection {
    constructor(origin, at, length) {
        this.origin = origin;
        this.at = at;
        this.length = length;
        this.origin = origin;
        this.at = at < 0 ? 0 : at;
        this.length = length < 0 ? 0 : length;
        this.endsAt = this.at + this.length;
    }
    hasSameOrgin(b) {
        return this.origin === b.origin;
    }
    moveRightBy(step) {
        return new Selection(this.origin, this.at + step, this.length);
    }
    expandBy(length) {
        return new Selection(this.origin, this.at, this.length + length);
    }
    isInside(position) {
        return this.at < position && this.endsAt > position;
    }
}
exports.Selection = Selection;
//# sourceMappingURL=selection.js.map