'use strict';

const f = require('../functions');
const u = require('../utils');

class Delete {
  constructor(at, length) {
    this.at = at;
    this.length = length;
  }

  apply(data) {
    data = u.ensureArrayLength(data, this.at);

    return f.concat(
      data.slice(0, this.at),
      data.slice(this.at + this.length)
    );
  }
}

module.exports = Delete;


