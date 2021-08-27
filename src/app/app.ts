import { IntentRequest } from "../models/IntentRequest";
import { Appointment } from "../models/appointment";
import { BotApiServiceCx } from "./bot.api.service.cx";
import { MongoClientConnection } from "./mongo-connector";
import { parseChat } from "./utils/chat.utils";
import { Dialog } from "./utils/dialog";
import { Social } from "./utils/social";
import { MailerService } from "./mailer.service";

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

    if(tag){
        if(tag ==="verify_code"){
            // get code
            let code = req.body.sessionInfo.parameters.code;
            
            // verify code
            const result = await dialog.verify_code(sessionId, code);
            
            const payload = Social.verifyCode(req, res, result);
            res.status(200).send(payload);
        
        }

        else if (tag ==="email_route_navigation") {
            let email = req.body?.sessionInfo?.parameters?.email;
            if (!email) {
                const payload = Social.emailRouteNavigation(req, res, false);
                res.status(200).send(payload);
            } else {
                const payload = Social.emailRouteNavigation(req, res, true);

                res.status(200).send(payload);
            }
        }
        else if (tag === "appointment.resend_code") {

            const email = req.body.sessionInfo.parameters.email;
            const ver_results = await dialog.verifyEmail( sessionId,email);

            const payload = Social.resendCode(req, res);
            res.status(200).send(payload);

         }
        else if (tag === "appointment.verify_date_time") {
            // get code
            const dateTime = new Date();
            // verify code
            const result = await dialog.verifyDateTime(sessionId, dateTime);
            
            // const payload = Social.verifyDateTime(req, res, result);
            // res.status(200).send(payload);
        }
        // Create appointment by picking details from session
        else if (tag === "appointment.create") {
            const email = req.body.sessionInfo.parameters.email;
            const location = req.body.sessionInfo.parameters.location;
            const quantity = req.body.sessionInfo.parameters.quantity;
            const dateTime = req.body.sessionInfo.parameters.datetime;
            const appointment = new Appointment(email, location, quantity, dateTime, dateTime);
            const result = await dialog.createAppointment(appointment,sessionId);

            const payload = Social.createAppointment(req, res, result, appointment);
            res.status(200).send(payload);

        }
            
        else if (tag === "appointment.update") {
            
        } else if (tag === "appointment.delete") {
            
        }
        //Reset the form to collect new input 
        else if(tag ==="reset_appointment_form"){
            const payload = Social.resetAppointment(req, res);
            res.status(200).send(payload);
            
        }
        else if(tag === "appointment.verify_email"){

            // get email
            const email = req.body.sessionInfo.parameters.email;
            const ver_results = await dialog.verifyEmail( sessionId,email);

            const payload = Social.verifyEmail(req, res, ver_results);
            res.status(200).send(payload);
        }
        else if(tag  === "getstarted"){
            //Create Session
            const results = await  dialog.getStarted(sessionId);

            const payload = Social.getStarted(req, res, sessionId);

            res.status(200).send(payload);  
        }
        else if(tag ==="check_appointment"){
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
 
    }else{
      const payload = Social.default(req, res);
      res.status(200).json(payload);
    }
  

});

server.post('/channels/web', async (req: any, res: any) => {

  const body = req.body as IntentRequest;

  let responseMessages;

  try {
      if (body.sessionId) {
          responseMessages = await BotApiServiceCx.detectIntentText(body);

      } else {
          // const sessionId = Math.random().toString(36).substring(7);

          responseMessages = await BotApiServiceCx.detectIntentText(body);

      }

  } catch (error) {

  }

  res.status(200).json(parseChat(responseMessages?.queryResult?.responseMessages));
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


