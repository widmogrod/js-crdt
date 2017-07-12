'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function between(value, min, max) {
    if (value <= min) {
        return false;
    }
    else if (value >= max) {
        return false;
    }
    return true;
}
exports.between = between;
function ensureArrayLength(array, len) {
    if (array.length < len) {
        array.length = len;
    }
    return array;
}
exports.ensureArrayLength = ensureArrayLength;
function sortNumbers(a, b) {
    return a - b;
}
exports.sortNumbers = sortNumbers;
function clone(obj) {
    var target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
}
exports.clone = clone;
function keyToMap(r, i) {
    r[i] = true;
    return r;
}
;
function union(a, b) {
    a = a.reduce(keyToMap, {});
    b = b.reduce(keyToMap, a);
    return Object.keys(b);
}
exports.union = union;
function common(a, b) {
    return Object.keys(a).reduce(function (r, k) {
        if (b.hasOwnProperty(k)) {
            r.push(k);
        }
        return r;
    }, []).sort();
}
exports.common = common;
function diff(a, b) {
    return Object.keys(a).reduce(function (r, k) {
        if (!b.hasOwnProperty(k)) {
            r.push(k);
        }
        return r;
    }, []);
}
exports.diff = diff;
//# sourceMappingURL=utils.js.map