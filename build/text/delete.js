"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Delete {
    constructor(at, length) {
        this.at = at;
        this.length = length;
    }
    apply(data) {
        if (this.at < 0)
            return data;
        let copy = data.slice(0);
        copy = utils_1.ensureArrayLength(copy, this.at);
        copy.splice(this.at, this.length);
        return copy;
    }
}
exports.Delete = Delete;
//# sourceMappingURL=delete.js.map