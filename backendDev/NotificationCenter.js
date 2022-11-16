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

<<<<<<< HEAD


=======
>>>>>>> 5a26ae08 (Documentation and small fixes)
module.exports = {sendMail}

