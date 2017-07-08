"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var functions_1 = require("../functions");
var Insert = (function () {
    function Insert(at, value) {
        this.at = at;
        this.value = String(value);
    }
    Insert.prototype.apply = function (data) {
        data = utils_1.ensureArrayLength(data, this.at);
        return functions_1.concat(functions_1.concat(data.slice(0, this.at), this.value.split('')), data.slice(this.at));
    };
    return Insert;
}());
exports.Insert = Insert;
//# sourceMappingURL=insert.js.map