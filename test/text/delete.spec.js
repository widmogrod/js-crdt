'use strict';

const {Delete, operationToArray} = require('../../build/text/index');
const assert = require('assert');

describe('text.Delete', () => {
  describe('Delete operation, applied on data', () => {
    const useCases = {
      'should remove first element': {
        at: 0,
        length: 1,
        data: ['a'],
        expected: []
      },
      'should leave data intact, when removed element does not exists': {
        at: 2,
        length: 1,
        data: ['a'],
        expected: ['a']
      },
      'should leave data intact, when index position is negative': {
        at: -2,
        length: 1,
        data: ['a'],
        expected: ['a']
      },
      'should remove portion of data': {
        at: 3,
        length: 2,
        data: ['k','t','o',' ', ' ', 'x'],
        expected: ['k','t','o', 'x']
      }
    };

    Object.keys(useCases).forEach(name => {
      const useCase = useCases[name];

      it(name, () => {
        const operation = new Delete(useCase.at, useCase.length);

        assert.deepEqual(
          operationToArray(useCase.data, operation),
          useCase.expected
        );
      });
    });
  });
});
