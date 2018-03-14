const { createEmailTemplate, updateEmailTemplate } = require('./sesTemplateService');
const htmlmsg = require('./confirmation-email.html');

createEmailTemplate("Renewals", htmlmsg, "Esure Renewals", "Dear {{name}},\r\nThanks for choosing to insure with esure this past year. It's now time to renew your policy. Your new quote for the next 12 months is £{{amount}}.");

updateEmailTemplate("Renewals", htmlmsg, "Esure Renewals", "Dear {{name}},\r\nThanks for choosing to insure with esure this past year. It's now time to renew your policy. Your new quote for the next 12 months is £{{amount}}.");