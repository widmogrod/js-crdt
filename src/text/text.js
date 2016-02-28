'use strict';

const f = require('../functions');

class Text {
  constructor(order, ordersIndex, operationsIndex) {
    this.order = order;
    this.ordersIndex = ordersIndex || [];
    this.operationsIndex = operationsIndex || [];

    this.index = this.ordersIndex.findIndex(o => o.equal(order));
    if (-1 === this.index) {
      this.index = this.ordersIndex.push(order) - 1;
    }

    this.operationsIndex[this.index] =
      this.operationsIndex[this.index] || [];
  }

  apply(operation) {
    this.operationsIndex[this.index].push(operation);
  }

  merge(b) {
    const ordersIndexA = this.ordersIndex.slice(0);
    let operationsIndexA = this.operationsIndex.slice(0);

    operationsIndexA = b.operationsIndex.reduce((operationsIndexA, operationsB, orderIndexB) => {
      const orderB = b.ordersIndex[orderIndexB];
      const notFoundInA = -1 === ordersIndexA.findIndex(orderA => orderA.equal(orderB));

      if (notFoundInA) {
        const index = ordersIndexA.push(orderB) - 1;

        operationsIndexA[index] = operationsB;
      }

      return operationsIndexA;
    }, operationsIndexA);

    return new Text(
      f.merge(this.order, b.order).next(),
      ordersIndexA,
      operationsIndexA
    );
  }

  equal(b) {
    return this.toString() === b.toString();
  }

  reduce(fn, accumulator) {
    return this.ordersIndex.slice(0).sort(f.compare).reduce((accumulator, order) => {
      const orderIndex = this.ordersIndex.findIndex(o => o.equal(order));

      return this.operationsIndex[orderIndex].reduce((accumulator, operation, index) => {
        return fn(accumulator, operation, order, index);
      }, accumulator);
    }, accumulator);
  }

  toString() {
    return this.reduce((accumulator, operation) => {
      return f.applyOperation(operation, accumulator);
    }, []).join('');
  }
}

module.exports = Text;
