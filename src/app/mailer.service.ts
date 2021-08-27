const nodemailer = require('nodemailer');
require("dotenv").config();

export class MailerService{



  static  sendEmail(email : string, code : string){
      const  mailOptions = {
            from: `"Nana Adwoa" <${process.env.GMAIL}>`,
            to: `${email}`,
            subject: 'COVID Appointment Booking',
            text: 'Hey!! 👋🏾, this is Nana Adwoa ;) ',
            html: `<b>Hey there!</b> 👋🏾 <br><br> This is Nana Adwoa,You here is a confirmation code <b> ${code} </b>to verify your email to set an appointment to book your covid vaccine shot.  <br><br> Best regards. <br>Nana Adwoa`
        };

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASS
            }
        });

      mailTransporter.sendMail(mailOptions, (error: any, info: any) => {
          console.log("Sending Emails:::");
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
    });
    }
}