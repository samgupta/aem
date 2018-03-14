const Mustache = require('mustache')

it('should print falses', () => {

  const test = {
    nested: {
      key: false
    }
  };
  const output = Mustache.render(`{{nested.key}}`, test);

  expect(output).toBe('false');

})

it('should print nested list values', () => {

  const test = {
    policyDetails: {
      results: {
        policyMotorVersions: [
          {
            mainDriver: 'driver'
          }
        ]
      }
    }
  };
  const output = Mustache.render(`{{#policyDetails.results.policyMotorVersions}}{{mainDriver}}{{/policyDetails.results.policyMotorVersions}}`, test);

  expect(output).toBe('driver');

})

it('should print cost', () => {
  const output = Mustache.render(`Do you want to include motor legal cover for £{{cost}}?`, {cost: 12.57});

  expect(output).toBe('Do you want to include motor legal cover for £12.57?');

})