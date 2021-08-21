

require('dotenv').config();

// Imports the Google Cloud Some API library
const { SessionsClient } = require('@google-cloud/dialogflow-cx');


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

        // projectId = 'stanbic-assistant';
        // location = 'us-central1';
        // agentId = '42273d66-29a4-43bc-88e0-616ed050b31a';
        // query = 'hello';
        // languageCode = 'en';
        // client: any;

        const client = new SessionsClient({
            apiEndpoint: 'us-central1-dialogflow.googleapis.com',
            keyFilename: "stanbic-assistant-e9b1b5fc3b08.json"
        });

        const sessionPath = client.projectLocationAgentSessionPath(
            intentRequest.projectId,
            intentRequest.location,
            intentRequest.agentId,
            intentRequest.sessionId
        );

        console.info("session path ", sessionPath);

        const langCode = intentRequest.languageCode;
        console.log(langCode)
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: intentRequest.query,
                },
                languageCode: intentRequest.languageCode
            },
        };

        console.log("Response ", request);

        const [response] = await client.detectIntent(request);
        console.log("Response ", response);

        console.log(`User Query: ${intentRequest.query}`);
        for (const message of response.queryResult.responseMessages) {
            console.log(message);
            if (message.text) {
                console.log(`Agent Response: ${message.text.text}`);
            }
        }
        if (response.queryResult.match.intent) {
            console.log(
                `Matched Intent: ${response.queryResult.match.intent.displayName}`
            );
        }
        console.log(
            `Current Page: ${response.queryResult.currentPage.displayName}`
        );

        return response;
    }

}

