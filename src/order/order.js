'use strict';

class Order {
  constructor(bucket, time) {
    this.bucket = bucket;
    this.time = time;
  }

  compare(b) {
    if (this.bucket === b.bucket) {
      return this.time - b.time;
    }

    return this.bucket < b.bucket ? -1 : 1;
  }
}

module.exports = Order;
