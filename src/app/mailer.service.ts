import { IAppointment } from "../models/appointment";

const nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars");
require("dotenv").config();

export class MailerService{


    mailTransporter:any;
  
    constructor() {
        this.mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASS
            }
        });

        const options = {
            viewEngine: {
                partialsDir: __dirname + "./../../assets/templates",
                layoutsDir: __dirname + "./../../assets/templates/layout",
                extname: ".hbs"
            },
            extName: ".hbs",
            viewPath: "assets/templates"
        };

    this.mailTransporter.use("compile", hbs(options));
    }

  sendConfirmationEmail(email : string, mailData: {code : string}){

      
    const  mailOptions = {
            from: `"Nana Adwoa" <${process.env.GMAIL}>`,
            to: `${email}`,
            subject: 'COVID Appointment Booking',
            template: "email_confirmation",
            context: mailData,
        };
        
        // html: `<b>Hey there!</b> 👋🏾 <br><br> This is Nana Adwoa,You here is a confirmation code <b> ${code} </b>to verify your email to set an appointment to book your covid vaccine shot.  <br><br> Best regards. <br>Nana Adwoa`
       

        this.mailTransporter.sendMail(mailOptions, (error: any, info: any) => {
            console.log("Sending Emails:::");
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
        });
    }

    sendAppointDetailsEmail(email : string,mailData: IAppointment){

      const  mailOptions = {
            from: `"Nana Adwoa" <${process.env.GMAIL}>`,
            to: `${email}`,
            subject: 'COVID Appointment Booking',
            template: "appointment_details",
            context: mailData,
        };
        
        // html: `<b>Hey there!</b> 👋🏾 <br><br> This is Nana Adwoa,You here is a confirmation code <b> ${code} </b>to verify your email to set an appointment to book your covid vaccine shot.  <br><br> Best regards. <br>Nana Adwoa`
       

      this.mailTransporter.sendMail(mailOptions, (error: any, info: any) => {
          console.log("Sending Emails:::");
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
    });
    }
}