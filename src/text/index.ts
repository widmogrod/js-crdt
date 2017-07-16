export * from './delete';
export * from './insert';

import {merge, applyOperation, compare, equal} from '../functions'
import {Orderer} from '../order'

interface Set<T> {
  add(T): number
  reduce<Y>(fn: (Y, T, number) => Y, accumulator: Y): Y
  index(number): T
}

class SortedSet<T extends Orderer<T>> implements Set<T> {
  elements: any

  constructor() {
    this.elements = [];
  }

  add(value: T): number {
    let index = this.elements.findIndex(({item}) => {
      return item.equal(value)
    });

    if (-1 === index) {
      index = this.elements.length;
      this.elements.push({item: value, index});
      this.elements.sort((a, b) => compare(a.item, b.item))
    }

    return index;
  }

  index(idx: number): T {
    const item = this.elements.find(({index}) => index === idx);
    if (item) {
      return item.item
    }
  }

  reduce<Y>(fn: (Y, T, number) => Y, accumulator: Y): Y {
    return this.elements.reduce((accumulator, {item, index}) => {
      return fn(accumulator, item, index);
    }, accumulator);
  }
}

export class Text {
    order: any
    ordersSet: any
    operationsIndex: any
    index: number
    constructor(order: any, ordersSet: any, operationsIndex: any) {
        this.order = order;
        this.ordersSet = ordersSet || new SortedSet();
        this.operationsIndex = operationsIndex || [];

        this.index = this.ordersSet.add(order);

        this.operationsIndex[this.index] =
            this.operationsIndex[this.index] || [];
    }

    next() {
      return new Text(
        this.order.next(),
        this.ordersSet,
        this.operationsIndex
      );
    }

    apply(operation) {
        this.operationsIndex[this.index].push(operation);
    }

    merge(b) {
        const ordersIndexA = this.ordersSet;
        let operationsIndexA = this.operationsIndex.slice(0);

        operationsIndexA = b.operationsIndex.reduce((operationsIndexA, operationsB, orderIndexB) => {
            const orderB = b.ordersSet.index(orderIndexB);
          if (!orderB) {
            return operationsIndexA;
          }
            const index = ordersIndexA.add(orderB);

            operationsIndexA[index] = operationsB;

            return operationsIndexA;
        }, operationsIndexA);

        return new Text(
            merge(this.order, b.order).next(),
            ordersIndexA,
            operationsIndexA
        );
    }

    equal(b) {
        return this.toString() === b.toString();
    }

    reduce(fn, accumulator) {
        return this.ordersSet.reduce((accumulator, order, orderIndex) => {
            return this.operationsIndex[orderIndex].reduce((accumulator, operation, index) => {
                return fn(accumulator, operation, order, index);
            }, accumulator);
        }, accumulator);
    }

    forEach(fn) {
        this.ordersSet.reduce((_, order, orderIndex) => {
            const operations = this.operationsIndex[orderIndex];
            fn({order, operations})
            return _;
        }, null);
    }

    toString() {
      return this.reduce((accumulator, operation) => {
            return applyOperation(operation, accumulator);
        }, []).join('');
    }
}
