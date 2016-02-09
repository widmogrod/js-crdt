'use strict';

class Increment {
  constructor(value) {
    this.value = value;
  }

  merge(b) {
    return new Increment(Math.max(this.value, b.value));
  }

  equal(b) {
    return this.value === b.value;
  }

  increment() {
    return new Increment(this.value + 1);
  }
}

module.exports = Increment;
