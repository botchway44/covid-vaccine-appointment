import { IntentRequest } from "../models/IntentRequest";
import { Appointment } from "../models/appointment";
import { BotApiServiceCx } from "./bot.api.service.cx";
import { MongoClientConnection } from "./mongo-connector";
import { parseChat } from "./utils/chat.utils";
import { Dialog } from "./utils/dialog";
import { Social } from "./utils/social";
import { MailerService } from "./mailer.service";
import { HOSPITALS, IHOSPITAL } from "./utils/hospitals";

const express = require('express');
const server = express();
const path = require("path");
const bodyParser = require('body-parser');
// const fs = require('fs')


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "../../.")));


let mongoClient: MongoClientConnection;
let dialog: Dialog;
let mailService : MailerService;
let botApiServiceCx  = new BotApiServiceCx();


server.post('/api/messages', async (req :any , res : any) => {

    console.log("------------------------------------------------------------------------")
    console.log("BODY :::",req.body)
    console.log("------------------------------------------------------------------------")
    let tag = req.body.fulfillmentInfo.tag;
    console.log("TAG:::",tag)
    console.log("------------------------------------------------------------------------")
    let sessionId = req.body?.sessionInfo?.parameters?.sessionId;
    // if sessionId doesnt exist, create it
    if(!sessionId){
        sessionId = Math.random().toString(36).substring(7);
    }
    console.log("sessionId:::",sessionId)
    console.log("------------------------------------------------------------------------")

    if (tag) {
        /**
         * Getstarted is called when the user first opens the chat. It registers the sessionId in the 
         * sessions collection and uses that to manage the conversation.
         */
        if(tag  === "getstarted"){
            //Create Session
            const results = await  dialog.getStarted(sessionId);

            const payload = Social.getStarted(req, res, sessionId);

            res.status(200).send(payload);  
        }
   
        /**
         * Gets a users appointment using the verified email
         */
        else if(tag ==="appointment.check"){
            // if we have an email and is veried, show appointment details
            const email = req.body.sessionInfo?.parameters?.email;
            let payload = {};
            if (email) {
                const appointment = await dialog.checkAppointment(email);
                payload = Social.checkAppointment(req, res, appointment);
            } else {
                payload = Social.checkAppointment(req, res, null);
            }
            res.status(200).send(payload);
        }
         /**
          * Creates an appointment from provided appointment details
          */
        else if (tag === "appointment.create") {
            const email = req.body.sessionInfo.parameters.email;
            const location:string = req.body.sessionInfo.parameters.location;
            const quantity = req.body.sessionInfo.parameters.quantity;
            const dateTime = req.body.sessionInfo.parameters.datetime;

            // get hospital
            const hospitals: IHOSPITAL[] = await HOSPITALS[location];
            let hospital: IHOSPITAL = hospitals[Math.ceil((Math.random() * (hospitals.length - 1)))];
            
            // get the hospital
            const appointment = new Appointment(email, location,hospital, quantity, dateTime, dateTime);
            const result = await dialog.createAppointment(appointment,sessionId);

            const payload = Social.createAppointment(req, res, result, appointment);
            res.status(200).send(payload);

        }
        /**
         * Verifies user entered code
         */
        else if(tag ==="appointment.verify_code"){
            // get code
            let code = req.body.sessionInfo.parameters.code;
            
            // verify code
            const result = await dialog.verify_code(sessionId, code);
            
            const payload = Social.verifyCode(req, res, result);
            res.status(200).send(payload);
        
        }
        /**
         * Resends the verification codeto the users email
         */
        else if (tag === "appointment.resend_code") {

            const email = req.body.sessionInfo.parameters.email;
            const ver_results = await dialog.verifyEmail( sessionId,email);

            const payload = Social.resendCode(req, res);
            res.status(200).send(payload);

        }
        /**
         * Verify if the time booked for the appointment is available.
         * If not, reset the state of the form asking for a new time and date
         */
        else if (tag === "appointment.verify_date_time") {
            // get code
            const dateTime = new Date();
            // verify code
            const result = await dialog.verifyDateTime(sessionId, dateTime);
            
            // const payload = Social.verifyDateTime(req, res, result);
            // res.status(200).send(payload);
        }
        /**
         * Reset page/form to collect new user inputs
         */
        else if(tag ==="appointment.reset_form"){
            const payload = Social.resetAppointment(req, res);
            res.status(200).send(payload);
            
        }
        /**
         * Picks the users email and sends a verification code
        */
        else if(tag === "appointment.verify_email"){

            // get email
            const email = req.body.sessionInfo.parameters.email;
            const ver_results = await dialog.verifyEmail( sessionId,email);

            const payload = Social.verifyEmail(req, res, ver_results);
            res.status(200).send(payload);
        }

    }

});

/**
 * Entry point to the Interactions API
 */
server.post('/channels/web', async (req: any, res: any) => {

    const body = req.body as IntentRequest;
    // add incomming chat message to mongo chats
    mongoClient.addChat(body);

  let responseMessages;

  try {
      if (body.sessionId) {
          responseMessages = await botApiServiceCx.detectIntentText(body);
      } else {
          responseMessages = await botApiServiceCx.detectIntentText(body);
      }

  } catch (error) {
    //TODO: log error with morgan & push to sentry
  }

    const response = parseChat(responseMessages?.queryResult?.responseMessages);
    mongoClient.addBulkChat(response);
    res.status(200).json(response);
});



const PORT = process.env.PORT || 9000;
mongoClient = new MongoClientConnection();
mailService = new MailerService();

mongoClient.connect().then(() => {
    console.log("Database is connected");
    dialog = new Dialog(mongoClient,mailService);
    server.listen(PORT, () => {
        console.log("App is running on port " + PORT);
        console.log('Listening for conversations ... on port ', PORT);
      });

})


