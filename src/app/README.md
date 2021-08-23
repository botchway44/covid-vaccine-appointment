 # dialogflowcx detect intent & fulfilment handler

## Getting started
This app side runs a simple nodejs server to detect intent and handle fulfilments/run as a web hook

Detecting Intents
=====================
To detect intents, an intent request is send to the interactions api with the following payload

   ```typescript
   export interface LOCATION_REQUEST {
         latitude: number
         longitude: number
         query: string
         intentQuery: string
      }

   export interface IIntentRequest {
      projectId: string
      agentId: string
      query: string | LOCATION_REQUEST
      languageCode: string
      sessionId: string

      requestType: REQUEST_TYPE
}

export type REQUEST_TYPE = "LOCATION" | "TEXT";

   ```


WebHook Custom Payloads
=====================
The widget uses custom chat widget which doesnt rely on the default [ dialogflow custom payloads ](https://cloud.google.com/dialogflow/cx/docs/concept/integration/dialogflow-messenger).

## Simple Text:
```json
{
   "text": {
      "text": ["Hi! This is a webhook response"]
   }
}
```


## 1. Sending Rich Chips:
```json
{
  "payload": [
    {
      "text": "Flowers",
      "imageUrl": "#",
      "id": 1
    },
    {
      "id": 2,
      "text": "Food",
      "imageUrl": "#"
    }
  ],
  "messageType": "RICHCHIPS"
}
```

## 2. Sending a location picker <br>
```json
{
            "chatType":"LOCATION_PICKER_BRANCH",
            "messageType": "LOCATION_PICKER_BRANCH",
}
```

## 3. Menu chips & regular Chips - The only difference is in their design <br>
 
```json
{
   "messageType": "MENU_CHIPS",
   "payload": [
      {
         "id": 1,
         "text": "Book Appointment"
      },
      {
         "text": "Check Appointment",
         "id": 2
      },
      {
         "text": "Covid Updates",
         "id": 3
      }
   ]
}
```


```json
{
        "messageType": "CHIPS",
        "payload": [
          {
            "id": 1,
            "text": "Accept"
          },
          {
            "text": "Decline",
            "id": 2
          }
        ]
}
```

## 4. List
```json
{
   "messageType": "LIST",
   "payload": [
      {
         "id": "",
         "heading": "This is a heading",
         "subheading": "This is the sub heading",
         "url": "Url to launch list when clicked",
         "imageUrl": "#"
         }
   ]
}
```

## API basics
To send any of these custom payloads,
```javascript

  const payload =
  {

      "messageType": "CHIPS",
      "payload": [
          {
              "text": "Webhook Chip 1",
              "id": 1
          },
          {
              "id": 2,
              "text": "Webhook Chip 2"
          },
          {
              "id": 3,
              "text": "Webhook chip 3"
          }
      ]

  };

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


```
See also an example of the widget use in a project:
[`dialogflowcx-chat-widget`](https://github.com/botchway44/covid-vaccine-appointment/blob/main/README.md),
