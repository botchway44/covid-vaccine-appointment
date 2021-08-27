import { IntentRequest } from "../models/IntentRequest";
import { BotApiServiceCx } from "./bot.api.service.cx";
import { MongoClientConnection } from "./mongo-connector";
import { parseChat } from "./utils/chat.utils";
import { Dialog } from "./utils/dialog";
import { Social } from "./utils/social";

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



server.post('/api/messages', async (req :any , res : any) => {

    console.log("------------------------------------------------------------------------")
    console.log("BODY :::",req.body)
    console.log("------------------------------------------------------------------------")
    let tag = req.body.fulfillmentInfo.tag;
    console.log("TAG:::",tag)
    console.log("------------------------------------------------------------------------")
    let sessionId = req.body.sessionInfo.parameters.sessionId;
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
        //Reset the form to collect new input 
        else if(tag ==="reset_appointment_form"){
            const payload = Social.resetAppointment(req, res);
            res.status(200).send(payload);
            
        }
        else if(tag === "appointment.verify_email"){

            // get email
            const email = req.body.sessionInfo.parameters.email;
            const pageInfo = req.body.pageInfo.formInfo.parameterInfo;

            const ver_results = await dialog.verifyEmail( sessionId,email);

            const payload = Social.verifyEmail(req, res, ver_results);
            res.status(200).send(payload);
        }
        else if(tag  === "getstarted"){
            //Create Session
            const res = await  dialog.getStarted(sessionId);
        }
        else if(tag ==="check_appointment"){
            // if we have an email and is veried, show appointment details
            const email = req.body.sessionInfo?.parameters?.email;
            
           if(!email){
          const payload =   {
                target_page: "projects/stanbic-assistant/locations/us-central1/agents/4883adeb-8d80-4383-8c3f-db6308741731/flows/00000000-0000-0000-0000-000000000000/pages/188f9011-8a45-43ae-9c94-09c088632d6b",
                fulfillment_response: { 
                    messages: [
                        {
                            text: {
                                //fulfillment text response to be sent to the agent
                                text: ["Hi! This is a to get email"]
                            }
                        }
                ] 
                } 
            }
           }
            // if we no email, ask for email

            // if we have email but not veried, verify email
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

mongoClient.connect().then(() => {
    console.log("Database is connected");
    dialog = new Dialog(mongoClient);
    server.listen(PORT, () => {
        console.log("App is running on port " + PORT);
        console.log('Listening for conversations ... on port ', PORT);
      });

})


