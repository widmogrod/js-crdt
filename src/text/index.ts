export * from './delete';
export * from './insert';

import {merge, applyOperation, compare} from '../functions'
import {Orderer} from '../order'

export class Text {
    order: any
    ordersIndex: any
    operationsIndex: any
    index: number
    constructor(order: any, ordersIndex: any, operationsIndex: any) {
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

        const orderNext = merge(this.order, b.order);
        return new Text(
            orderNext.next(),
            ordersIndexA,
            operationsIndexA
        );
    }

    equal(b) {
        return this.toString() === b.toString();
    }

    reduce(fn, accumulator) {
        return this.ordersIndex.slice(0).sort(compare).reduce((accumulator, order) => {
          // const orderIndex = this.ordersIndex.findIndex(o => o.equal(order));
            const orderIndex = this.ordersIndex.findIndex(o => o === order);

            return this.operationsIndex[orderIndex].reduce((accumulator, operation, index) => {
                return fn(accumulator, operation, order, index);
            }, accumulator);
        }, accumulator);
    }

    forEach(fn) {
        return this.ordersIndex.slice(0).sort(compare).forEach(order => {
            const orderIndex = this.ordersIndex.findIndex(o => o.equal(order));
            const operations = this.operationsIndex[orderIndex];

            fn({order, operations})
        });
    }

    toString() {
      return this.reduce((accumulator, operation) => {
            return applyOperation(operation, accumulator);
        }, []).join('');
    }
}
