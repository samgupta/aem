const { publishMsgToNumber, sendTemplatedEmail } = require('../notification-api');

const isNotLastNodeInTree = (session) => {
  return session.conversationData.conversation.current.children.length > 0;
};

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters
    [
      new supercharger.Parameter(
        "amount",
        "The amount of money the customer paid",
        "string"
      ),
      new supercharger.Parameter(
        "message",
        "Message to be sent",
        "string"
      ),
      new supercharger.Parameter(
        "subject",
        "Subject of the message",
        "string"
      ),
      new supercharger.Parameter(
        "user_message",
        "Message spoken to user to tell them they're getting an SMS and Email",
        "string"
      )
    ],

    // Supercharger Name
    "Notify Customer",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      let name = session.userData.surname;
      let phoneNumber = session.userData.phone_number;
      let email = session.userData.email;
      let msg = customArguments.message;
      let subject = customArguments.subject || "NOTICE";
      let amount = customArguments.amount;
      let startDate = session.userData.readableRelativeStartDate;
      let endDate = session.userData.readableRelativeEndDate;
      session.send(customArguments.user_message);
      
      publishMsgToNumber(msg, phoneNumber, subject);
      
      sendTemplatedEmail("Renewals", [email], {name: name, amount: amount, startDate: startDate, endDate: endDate});
      
      if (isNotLastNodeInTree(session)) {
        skip(session, args, next);
      }
    },
    // Supercharger ID
    "notify_customer"
  );