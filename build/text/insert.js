"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Insert {
    constructor(at, value) {
        this.at = at;
        this.value = value;
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
        this.length = this.value.length;
        this.endsAt = this.at + this.length;
    }
}
exports.Insert = Insert;
//# sourceMappingURL=insert.js.map