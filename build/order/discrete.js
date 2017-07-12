"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Discrete = (function () {
    function Discrete(id, vector) {
        vector = utils_1.clone(vector);
        vector[id] = vector[id] || 0;
        this.id = id;
        this.vector = vector;
    }
    Discrete.prototype.next = function () {
        var vector = utils_1.clone(this.vector);
        ++vector[this.id];
        return new Discrete(this.id, vector);
    };
    Discrete.prototype.merge = function (b) {
        var _this = this;
        var vector = utils_1.union(Object.keys(this.vector), Object.keys(b.vector)).reduce(function (vector, key) {
            vector[key] = Math.max(_this.vector[key] || 0, b.vector[key] || 0);
            return vector;
        }, {});
        return new Discrete(this.id, vector);
    };
    Discrete.prototype.equal = function (b) {
        return this.compare(b) === 0;
    };
    Discrete.prototype.compare = function (b) {
        var _this = this;
        var position = utils_1.common(this.vector, b.vector)
            .reduce(function (result, key) {
            return result + (_this.vector[key] - b.vector[key]);
        }, 0);
        if (position !== 0) {
            return position;
        }
        var difA = utils_1.diff(this.vector, b.vector).length;
        var difB = utils_1.diff(b.vector, this.vector).length;
        var dif = difA - difB;
        if (dif !== 0) {
            return dif;
        }
        var tipPosition = this.vector[this.id] - b.vector[b.id];
        if (tipPosition !== 0) {
            return tipPosition;
        }
        var ha = b.vector.hasOwnProperty(this.id);
        var hb = this.vector.hasOwnProperty(b.id);
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
    };
    return Discrete;
}());
exports.Discrete = Discrete;
//# sourceMappingURL=discrete.js.map