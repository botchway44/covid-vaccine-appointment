import { IntentRequest } from "../models/IntentRequest";
import { BotApiServiceCx } from "./bot.api.service.cx";
import { MongoClientConnection } from "./mongo-connector";
import { parseChat } from "./utils/chat.utils";
import { Dialog } from "./utils/dialog";

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


const payload =
{

    "messageType": "CHIPS",
    "payload": [
        {
            "text": "Webhook Balance",
            "id": 1
        },
        {
            "id": 2,
            "text": "Webhook Check Fx Rate"
        },
        {
            "id": 3,
            "text": "Webhook View services"
        }
    ]

};


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
            const result = dialog.verify_code(sessionId,code);
            if(result){
            // send verified payload
            console.log("Verification DONE");
            res.status(200).send({
                target_page: "projects/stanbic-assistant/locations/us-central1/agents/4883adeb-8d80-4383-8c3f-db6308741731/flows/00000000-0000-0000-0000-000000000000/pages/188f9011-8a45-43ae-9c94-09c088632d6b",
                pageInfo:{
                        formInfo : { 
                            parameterInfo :  [
                                {
                                    displayName: 'code',
                                    required: true,
                                    state: 'FILLED',
                                    value: req.body.sessionInfo.parameters.code,
                                    justCollected: true
                                  },
                             ]
                             },
                        sessionInfo: {
                            parameters: {                         
                                ...req.body.sessionInfo.parameters,
                                verified : "true"
                            }
                        }
                        
                },   
            });
        }
        else{
            // send Unverified
            console.log("Verification Failed");
            res.status(200).send({
                pageInfo:{
                        formInfo : { 
                            parameterInfo :  [
                                {
                                    displayName: 'code',
                                    required: true,
                                    state: 'FILLED',
                                    value: req.body.sessionInfo.parameters.code,
                                    justCollected: true
                                  },
                             ]
                             },
                        sessionInfo: {
                            parameters: {                         
                                ...req.body.sessionInfo.parameters,
                                verified : "false"
                            }
                        }
                        
                },   
            });
        }
        }
        //Reset the form to collect new input 
        else if(tag ==="reset_appointment_form"){
            res.status(200).send({
                pageInfo:{
                        formInfo : { 
                            parameterInfo :  [
                                {
                                    displayName: 'email',
                                    required: true,
                                    state: 'EMPTY',
                                    value: '',
                                    justCollected: false
                                  },
                            { displayName: 'verified', state: 'FILLED', value: 'false' }
                             ]
                             },
                        sessionInfo: {
                            parameters: {                         
                                email: "",
                                verified : "false"
                            }
                        }
                        
                    },
                      
            });
        }
        else if(tag === "appointment.verify_email"){

                // get email
                const email = req.body.sessionInfo.parameters.email;
                const pageInfo = req.body.pageInfo.formInfo.parameterInfo;

                // get session and send 4 digit code
                
                dialog.verify_email( sessionId,email);

                res.status(200).send({
                    
                    pageInfo:{
                            currentPage : req.body.pageInfo.formInfo.parameterInfo.currentPage,
                            formInfo : { 
                                parameterInfo :  [
                                    {
                                        displayName: 'email',
                                        required: true,
                                        state: 'FILLED',
                                        value: email,
                                        justCollected: true
                                      },
                                    { displayName: 'verified', state: 'FILLED', value: 'false' }
                                 ]
                        }
                        },
                    sessionInfo: {
                        session:req.body.sessionInfo.session,
                        parameters: {                         
                            email: email,
                            verified : "false"
                        }
                        }
                          
                });
        }
        else if(tag  === "getstarted"){
          const res = await  dialog.getStarted(sessionId);

          if(res){
            // Welcome message, session created
          }else{
            // Welcome Message, but couldnt create session
          }
        }
        else if(tag ==="check_appointment"){
            // if we have an email and is veried, show appointment details
           const email =req.body.sessionInfo?.parameters?.email;
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
        // process no tags
            // get session info and resend 
            const session_info = req.body.sessionInfo;
            //const parameters = req.body.
            let jsonResponse = {
                fulfillment_response: {
                    messages: [
                        {
                            payload: payload
                        },
                        {
                            text: {
                                //fulfillment text response to be sent to the agent
                                text: ["Hi! This is a webhook response"]
                            }
                        }
                    ]
                },
                sessionInfo: {
                    user_id: "john Doe"
                }
            };


      res.status(200).json(jsonResponse);

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


