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
