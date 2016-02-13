'use strict';

const f = require('../functions');
const u = require('../utils');

class Insert {
  constructor(at, value) {
    this.at = at;
    this.value = String(value);
  }

  apply(data) {
    data = u.ensureArrayLength(data, this.at);

    return f.concat(
      data.slice(0, this.at),
      this.value.split(''),
      data.slice(this.at)
    );
  }
}

module.exports = Insert;
