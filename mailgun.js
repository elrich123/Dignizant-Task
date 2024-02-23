const mg = require('mailgun-js')
require("dotenv").config();


var api_key = process.env.MAILGUN_API_KEY;
var domain = process.env.MAILGUN_DOMAIN;

const mailgun = require('mailgun-js')
    ({ apiKey: api_key, domain: domain });

const sendMail = async ( recieverEmail, subject, body ) => {

    const data = {
        "from": "elrich1997@gmail.com",
        to: recieverEmail,
        subject: subject,
        text: body
    };
 
    await mailgun.messages().send(data, (error, body) => {
        if (error) console.log(error)
        else console.log(body);
    });
}

module.exports = sendMail