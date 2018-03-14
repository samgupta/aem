const builder = require('botbuilder');

const pricesForAddons = [
  {
    name: "Breakdown", 
    price: "£87.00",
    image: "https://azcdubvermedia.azureedge.net/media/themes/fab-four/article-content-images/car-insurance/breakdown-cover-main-2.png?la=en-GB", 
    description: "Roadside assistance and breakdown coverage are services that assist motorists, or bicyclists, whose vehicles have suffered a mechanical failure that leaves the operator stranded."
  },
  {
    name: "Motor Legal",
    price: "£12.57",
    image: "https://www.directline.com/lib/img/user-guides/legal-protection/legal-protection-hero.jpg", 
    description: "Motor Legal Protection is there for you to help you recover losses you are not covered for by other insurance cover you may have. If you or your passenger are injured in an accident, Motor Legal Protection could help you claim compensation for those injuries."
  },
  {
    name: "Personal Injury",
    price: "£99.99",
    image: "http://torontospersonalinjurylawyer.com/wp-content/uploads/2016/06/Personal-Injury-845x559.jpg", 
    description: "Even the most careful driver can be involved in an accident at any time. If you or any named drivers on your policy are injured in an accident, Personal Injury Cover can help regardless of whether or not you’re at fault. Each insured person could receive a lump sum up to £30,000 per insured person, per accident depending on the injury sustained."
  },
  {
    name: "Car Hire",
    price: "£23.78",
    image: "http://malagatravelguide.net/wp-content/uploads/2013/08/cheap-car-hire.jpg", 
    description: "Add our Car Hire to your policy and if your car is stolen and not recovered or we agree with you that it is a total loss, you will get a similar type and sized hire car by the end of the next working day for up to 21 days whilst we sort out your claim. If you wish to extend the hire period beyond this date you can do so at discounted rates and at your own expense."
  },
  {
    name: "Handbag",
    price: "£5.45",
    image: "https://www.dhresource.com/0x0s/f2-albu-g1-M01-AA-77-rBVaGFa90jaARja-AAD4WWykDJ8772.jpg/2018-new-fashion-trend-handbags-handbag-shoulder.jpg", 
    description: "esure personal possessions insurance covers most items that you’d take with you out of the house. These items can be anything from mobile phones to jewellery, or even items like your clothes and bike. We also cover any cash up to £750 that you might have with you."
  },
  {
    name: "NCD Protection",
    price: "£123.45",
    image: "http://malagatravelguide.net/wp-content/uploads/2013/08/cheap-car-hire.jpg", 
    description: "Protecting your NCB allows you to have a certain amount of “at fault” accidents without affecting the bonus. So if you have an accident, the NCB remains intact even if your insurer can’t claim their costs back."
  }
];

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters
    [],

    // Supercharger Name
    "Offer Addon",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      let addonsNotOnPolicy = session.userData.policies[0].policyMotorVersions[0].addOns.filter(
        addon => !addon.isAddedToPolicy && !addon.hasBeenOffered
      );

      if (addonsNotOnPolicy.length > 0) {
        let randomAddon =
          addonsNotOnPolicy[Math.floor(Math.random() * addonsNotOnPolicy.length)];
        let nameOfAddon = randomAddon.name;

        // TODO rewrite functions for returning price when cross-sell API provided
        let randomAddonToCheckPriceOf = pricesForAddons.find(
          addon => addon.name === randomAddon.name
        );
        let priceOfAddon = randomAddonToCheckPriceOf.price;

        const heroCard = new builder.HeroCard(session)
        .title(nameOfAddon)
        .subtitle(`Only ${priceOfAddon}`)
        .text(randomAddonToCheckPriceOf.description)
        .images([
          builder.CardImage.create(session, randomAddonToCheckPriceOf.image),
          builder.CardImage.create(session, "https://s3.eu-west-2.amazonaws.com/esure-voice-poc-images/brand/esure-voice-background.png")
        ]);
      
        // attach the card to the reply message
        const msg = new builder.Message(session)
          .text(`Would you like to purchase ${nameOfAddon} cover for an additional ${priceOfAddon}?`)
          .addAttachment(heroCard);

        // Send Card
        session.send(msg);

        session.userData.hasBeenAskedUpsellQ = true;
        session.userData.addonOffered = nameOfAddon;
        session.userData.policies[0].policyMotorVersions[0].addOns.find(addOn => addOn.name === nameOfAddon).hasBeenOffered = true;
      } else {
        session.userData.hasBeenAskedUpsellQ = false;
        skip(session, args, next);
      }
    },

    // Supercharger ID
    "offer_addon"
  );
