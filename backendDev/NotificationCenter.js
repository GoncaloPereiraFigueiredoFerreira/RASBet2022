var nodemailer = require('nodemailer');


function sendMail(destination,subject,text){

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
      html: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 


}

let fs = require('fs');
let msg = fs.readFileSync("/home/ganso133/Desktop/index.html","utf-8");

sendMail("pg50003@alunos.uminho.pt","Coisa mai linda",msg)

module.exports = {sendMail}

