'use strict';

exports.between = between;
function between(value, min, max) {
  if (value <= min) {
    return false;
  } else if (value >= max) {
    return false;
  }

  return true;
}

exports.ensureArrayLength = ensureArrayLength;
function ensureArrayLength(array, len) {
  if (array.length < len) {
    array.length = len;
  }

  return array;
}

exports.sortNumbers = sortNumbers;
function sortNumbers(a, b) {
  return a - b;
}

exports.clone = clone;
function clone(obj) {
  const target = {};

  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
}

const keyToMap = (r, i) => {
  r[i] = true;
  return r;
};

exports.union = union;
function union(a, b) {
  return Object.keys(
    b.reduce(
      keyToMap,
      a.reduce(keyToMap, {})
    )
  );
}

exports.common = common;
function common(a, b) {
  return Object.keys(a).reduce((r, k) => {
    if (b.hasOwnProperty(k)) {
      r.push(k);
    }

    return r;
  }, []).sort();
}
