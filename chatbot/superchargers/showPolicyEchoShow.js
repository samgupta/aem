const Mustache = require('mustache');
const builder = require('botbuilder');

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters
    [
      new supercharger.Parameter("Message", "The text to return to the user", "string"),
      new supercharger.Parameter("Title", "The title for the Echo Show", "string"),            
      new supercharger.Parameter("Main_Text", "The text for the Echo Show", "string"),            
    ],

    // Supercharger Name
    "Display new Policy",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      let message = Mustache.render(customArguments.Message, session.userData);
      message = message.trim();
    
      let cardTitle = Mustache.render(customArguments.Title, session.userData);
      cardTitle = cardTitle.trim();

      let cardText = Mustache.render(customArguments.Main_Text, session.userData);
      cardText = cardText.trim();

      const heroCard = new builder.HeroCard(session)
      .title(cardTitle)
      .text(cardText)
      .images([
        builder.CardImage.create(session, "https://www.enterprise.co.uk/content/dam/global-vehicle-images/cars/VAUX_INSI_2014.png"),
        builder.CardImage.create(session, "https://s3.eu-west-2.amazonaws.com/esure-voice-poc-images/brand/esure-voice-background.png")
      ]);
    
      // attach the card to the reply message
      const msg = new builder.Message(session)
        .text(message)
        .addAttachment(heroCard);

      // Send Card
      session.send(msg);
    },

    // Supercharger ID
    "policy_playback"
  );
        