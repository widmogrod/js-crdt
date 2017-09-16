const assert = require('assert');
const {between} = require('../build/functions');

describe('functions', () => {
  describe('between()', () => {
    const useCases = {
      'should return true when is between two numbers': {
        value: 2,
        min: 1,
        max: 3,
        expected: true
      },
      'should return false when is equal to lower boundary': {
        value: 1,
        min: 1,
        max: 2,
        expected: false
      },
      'should return false when is equal to upper boundary': {
        value: 2,
        min: 1,
        max: 2,
        expected: false
      },
      'should return false when is bellow lower boundary': {
        value: 0,
        min: 1,
        max: 2,
        expected: false
      },
      'should return false when is above upper boundary': {
        value: 3,
        min: 1,
        max: 2,
        expected: false
      },
    };

    Object.keys(useCases).forEach(name => {
      const useCase = useCases[name];

      it(name, () => {
        assert(
          between(useCase.value, useCase.min, useCase.max) === useCase.expected,
          'value is not between given values'
        );
      });
    });
  });
});
