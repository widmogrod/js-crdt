"use strict";
var utils_1 = require('../utils');
var functions_1 = require('../functions');
var Delete = (function () {
    function Delete(at, length) {
        this.at = at;
        this.length = length;
    }
    Delete.prototype.apply = function (data) {
        data = utils_1.ensureArrayLength(data, this.at);
        return functions_1.concat(data.slice(0, this.at), data.slice(this.at + this.length));
    };
    return Delete;
}());
exports.Delete = Delete;
//# sourceMappingURL=delete.js.map