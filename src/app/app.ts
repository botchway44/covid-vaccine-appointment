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


server.post('/api/messages', (req :any , res : any) => {

    console.log("------------------------------------------------------------------------")
    console.log("BODY :::",req.body)
    console.log("------------------------------------------------------------------------")
    let tag = req.body.fulfillmentInfo.tag;
    console.log("TAG:::",tag)
    console.log("------------------------------------------------------------------------")

    if(tag){
        if(tag === "appointment.email_booked"){

                // get email
                const email = req.body.sessionInfo.parameters.email;
                const pageInfo = req.body.pageInfo.formInfo.parameterInfo;
                const verified = true;
                // set as verified

                let session_info = req.body.sessionInfo;

                console.log("Page info ", pageInfo)
                // return results
                // const results = ;
                res.status(200).send({
                    
                    pageInfo:{
                            currentPage : req.body.pageInfo.formInfo.parameterInfo.currentPage,
                            formInfo : { 
                                parameterInfo :  [
                                    {
                                        displayName: 'email',
                                        required: true,
                                        state: 'PARAMETER_STATE_UNSPECIFIED',
                                        value: 'doe@gmail.com',
                                        justCollected: true
                                      },
                                { displayName: 'verified', state: 'FILLED', value: 'true' }
                                 ]
                        }
                        },
                        sessionInfo: {
                            session:req.body.sessionInfo.session,
                            parameters: {                         
                                email: "botwe@gmail.com",
                                verified : "true"
                            }
                            }
                          
                });
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


  // verify if session id is passed
  // detect the intent

//   console.log("intent response ", responseMessages?.queryResult);

  res.status(200).json(parseChat(responseMessages?.queryResult?.responseMessages));
  // res.status(200).json(responseMessages.queryResult);
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


