"use strict";
var nodemailer = require('nodemailer');
/**
 * Sends an email to a user
 * @param destination The destination email
 * @param subject The subject of the email
 * @param text The text
 * @param html HTML of the email (optional)
 */
function sendMail(destination, subject, text, html) {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "rasbet49@gmail.com",
            pass: "jjycycbhvogwalqs"
        }
    });
    var mailOptions = {
        from: 'rasbet@rasbet.com',
        to: destination,
        subject: 'RASBET Notification Center:' + subject,
        html: html,
        text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = { sendMail };
