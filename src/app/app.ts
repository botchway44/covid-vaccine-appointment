import { IntentRequest } from "../models/IntentRequest";
import { BotApiServiceCx } from "./bot.api.service.cx";
import { parseChat } from "./utils/chat.utils";

const { WebhookClient } = require('dialogflow-fulfillment');
const express = require('express');
const server = express();
const path = require("path");
// const fs = require('fs')
const bodyParser = require('body-parser');


server.use(bodyParser.json());


// const expressApp = express().use(bodyParser.json());

// Add a get Response for the assistant
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "../../.")));


server.post('/api/messages', (req :any , res : any) => {

   
  console.log((req.body))

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

  // get session info and resend 
  const session_info = req.body.sessionInfo;

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


  console.log("---------------------------------------------------")
  // console.log(jsonResponse);

  res.status(200).json(jsonResponse);

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

  console.log("intent response ", responseMessages?.queryResult);

  res.status(200).json(parseChat(responseMessages?.queryResult?.responseMessages));
  // res.status(200).json(responseMessages.queryResult);
});



const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log('Listening for conversations ... on port ', PORT);
});
