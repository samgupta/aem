const YakInTheBox = require("@capgemini-aie/yak-in-the-box");
const offerAddonSC = require('./offerAddon')(YakInTheBox.supercharger);

let createMockSessionWithAddOns = (addOns) => {
  return {
    userData: {
      policies: [
        {
          policyMotorVersions: [
            {
              addOns: addOns
            }
          ]
        }
      ]
    },
    send: jest.fn(),
    gettext: jest.fn(),
    message: {}
  };
};

it('should not offer an add on if the customer has everything', () => {
  const session = createMockSessionWithAddOns([
    {name: 'Breakdown', isAddedToPolicy: true},
    {name: 'Motor Legal', isAddedToPolicy: true}
  ]);

  const skip = jest.fn();
  const args = {};
  const next = {};
  offerAddonSC.function(session, args, next, {}, skip);

  expect(session.send.mock.calls.length).toBe(0);
  expect(skip).toBeCalledWith(session, args, next);
  expect(session.userData.hasBeenAskedUpsellQ).toBe(false);
  expect(session.userData.addonOffered).toBeUndefined();

});

it('should not offer an add on if the customer has already been offered it', () => {
  const session = createMockSessionWithAddOns([
    {name: 'Breakdown', isAddedToPolicy: false, hasBeenOffered: true},
    {name: 'Motor Legal', isAddedToPolicy: true}
  ]);

  const skip = jest.fn();
  const args = {};
  const next = {};
  offerAddonSC.function(session, args, next, {}, skip);

  expect(session.send.mock.calls.length).toBe(0);
  expect(skip).toBeCalledWith(session, args, next);
  expect(session.userData.hasBeenAskedUpsellQ).toBe(false);
  expect(session.userData.addonOffered).toBeUndefined();

});

it('should offer an add on if the customer does not have it', () => {
  const session = createMockSessionWithAddOns([
    {name: 'Breakdown', isAddedToPolicy: false},
    {name: 'Motor Legal', isAddedToPolicy: true}
  ]);

  const skip = jest.fn();
  offerAddonSC.function(session, {}, {}, {}, skip);

  expect(session.send.mock.calls.length).toBe(1);
  expect(skip.mock.calls.length).toBe(0);
  expect(session.userData.hasBeenAskedUpsellQ).toBe(true);
  expect(session.userData.addonOffered).toBe('Breakdown');
  expect(session.userData.policies[0].policyMotorVersions[0].addOns[0].hasBeenOffered).toEqual(true);

});

it('should offer an add on if the customer does not have it and hasnt explicitly been offered it', () => {
  const session = createMockSessionWithAddOns([
    {name: 'Breakdown', isAddedToPolicy: false, hasBeenOffered: false},
    {name: 'Motor Legal', isAddedToPolicy: true}
  ]);

  const skip = jest.fn();
  offerAddonSC.function(session, {}, {}, {}, skip);

  expect(session.send.mock.calls.length).toBe(1);
  expect(skip.mock.calls.length).toBe(0);
  expect(session.userData.hasBeenAskedUpsellQ).toBe(true);
  expect(session.userData.addonOffered).toBe('Breakdown');
  expect(session.userData.policies[0].policyMotorVersions[0].addOns[0].hasBeenOffered).toEqual(true);

});