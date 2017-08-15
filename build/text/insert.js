"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Insert {
    constructor(at, value) {
        this.at = at;
        this.value = value;
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
    }
    apply(data) {
        let copy = data.slice(0);
        copy = utils_1.ensureArrayLength(copy, this.at);
        copy.splice(this.at, 0, ...this.value.split(''));
        return copy;
    }
}
exports.Insert = Insert;
//# sourceMappingURL=insert.js.map