'use strict';

const {Insert, operationToArray} = require('../../build/text/index');
const assert = require('assert');

describe('text.Insert', () => {
  describe('Insert operation, applied on data', () => {
    const useCases = {
      'should insert as first element': {
        at: 0,
        value: 'abc',
        data: [],
        expected: ['a','b', 'c']
      },
      'should insert as first element when position in negative number': {
        at: -1,
        value: 'abc',
        data: ['1', '2', '3'],
        expected: ['a', 'b', 'c', '1', '2', '3']
      },
      'should fill data to position at witch modification was performed': {
        at: 3,
        value: 'abc',
        data: [],
        expected: [,,, 'a', 'b', 'c'] // eslint-disable-line
      },
      'should populate longer data, without loosing information': {
        at: 2,
        value: 'to',
        data: ['k', 't', 'o', ' ', ' ', 'x'],
        expected: ['k', 't', 't', 'o', 'o',' ', ' ', 'x']
      }
    };

    Object.keys(useCases).forEach(name => {
      const useCase = useCases[name];

      it(name, () => {
        const operation = new Insert(useCase.at, useCase.value);

        assert.deepEqual(
          operationToArray(useCase.data, operation),
          useCase.expected
        );
      });
    });
  });
});
