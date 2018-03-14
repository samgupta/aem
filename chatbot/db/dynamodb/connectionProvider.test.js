const removeNullsUndefinedsAndEmptyStrings = require('./connectionProvider').removeNullsUndefinedsAndEmptyStrings

it('should not remove false values', () => {
  const test = {
    key: false,
    values: [
      {
        key: false
      }
    ],
    nested: {
      key: false
    }
  }

  removeNullsUndefinedsAndEmptyStrings(test);

  expect(test.key).toBe(false);
  expect(test.values[0].key).toBe(false);
  expect(test.nested.key).toBe(false);

})

it('should remove null undefined and empty string values', () => {
  const test = {
    key: null,
    values: [
      {
        key: null
      }
    ],
    nested: {
      key: null
    },
    key2: undefined,
    values2: [
      {
        key: undefined
      }
    ],
    nested2: {
      key: undefined
    },
    key3: '',
    values3: [
      {
        key: ''
      }
    ],
    nested3: {
      key: ''
    }
  };

  removeNullsUndefinedsAndEmptyStrings(test);

  expect(test.key).toBe(undefined);
  expect(test.values[0].key).toBe(undefined);
  expect(test.nested.key).toBe(undefined);

  expect(test.key2).toBe(undefined);
  expect(test.values2[0].key).toBe(undefined);
  expect(test.nested2.key).toBe(undefined);

  expect(test.key3).toBe(undefined);
  expect(test.values3[0].key).toBe(undefined);
  expect(test.nested3.key).toBe(undefined);

})