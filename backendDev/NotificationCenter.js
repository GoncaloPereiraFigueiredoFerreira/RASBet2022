var nodemailer = require('nodemailer');


function sendMail(destination,subject,text,html){

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
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 


}



module.exports = {sendMail}

