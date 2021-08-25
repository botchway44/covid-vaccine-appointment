
require('dotenv').config();

// Imports the Google Cloud Some API library
// const { SessionsClient } = require('@google-cloud/dialogflow-cx');
import { SessionsClient } from "@google-cloud/dialogflow-cx/build/src/v3/sessions_client";
const {struct} = require('pb-util');

export class BotApiServiceCx {

    constructor() {
        /**
        * Example for regional endpoint:
        *   const location = 'us-central1'
        *   const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})
        */

    }


    static async detectIntentText(intentRequest: any) {
        // const sessionId =  Math.random().toString(36).substring(7);

        const client = new SessionsClient({
            apiEndpoint: 'us-central1-dialogflow.googleapis.com',
            projectId : process.env.DF_PROJECT_ID,
            credentials : {
                client_email : process.env.DF_CLIENT_EMAIL,
                private_key: process.env.DF_PRIVATE_KEY
            },
            language: "en"
        });

        const sessionPath = client.projectLocationAgentSessionPath(
            intentRequest.projectId,
            intentRequest.location,
            intentRequest.agentId,
            intentRequest.sessionId
        );

        // console.info("session path ", sessionPath);

        const langCode = intentRequest.languageCode;
        // console.log(langCode)
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: intentRequest?.query,
                },
                languageCode: intentRequest?.languageCode
            },
            queryParams:{
                parameters:struct.encode({
                    sessionId : intentRequest.sessionId
                })
            }
        };

        // console.log("Session Response ", request);

        const [response] = await client.detectIntent(request);
        // console.log("Query Response ", JSON.stringify(response));

        console.log(`User Query: ${intentRequest?.query}`);
        if(response?.queryResult?.responseMessages){
        for (const message of response?.queryResult?.responseMessages) {
            console.log(message);
            if (message.text) {
                console.log(`Agent Response: ${message?.text?.text}`);
            }
        }
    }
        if (response?.queryResult?.match?.intent) {
            console.log(
                `Matched Intent: ${response?.queryResult?.match?.intent?.displayName}`
            );
        }
        console.log(
            `Current Page: ${response?.queryResult?.currentPage?.displayName}`
        );

        return response;
    }

}

