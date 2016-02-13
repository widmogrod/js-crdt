'use strict';

const u = require('../utils');

class Discrete {
  constructor(id, vector) {
    vector = u.clone(vector);
    vector[id] = vector[id] || 0;

    this.id = id;
    this.vector = vector;
  }

  next() {
    var vector = u.clone(this.vector);
    ++vector[this.id];
    return new Discrete(this.id, vector);
  }

  merge(b) {
    let vector = u.union(
      Object.keys(this.vector),
      Object.keys(b.vector)
    ).reduce((vector, key) => {
      vector[key] = Math.max(
        this.vector[key] || 0,
        b.vector[key] || 0
      );

      return vector;
    }, {});

    return new Discrete(this.id, vector);
  }

  equal(b) {
    return this.compare(b) === 0;
  }

  compare(b) {
    let r = u.common(this.vector, b.vector)
      .reduce((result, key) => {
        return result + (this.vector[key] - b.vector[key]);
      }, 0);

    if (r === 0) {
      let x = this.vector[this.id] - b.vector[b.id];
      if (x !== 0) {
        return x;
      }

      let ha = b.vector.hasOwnProperty(this.id);
      let hb = this.vector.hasOwnProperty(b.id);

      if (!ha && !hb) {
        return this.id < b.id ? -1 : 1;
      } else if (ha && !hb) {
        return -1;
      } else if (hb && !ha) {
        return 1;
      }
    }

    return r;
  }
}

module.exports = Discrete;
