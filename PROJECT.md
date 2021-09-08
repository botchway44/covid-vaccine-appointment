# Covid Vaccine Appointment ChatBot

<!--- Replace <OWNER> with your Github Username and <REPOSITORY> with the name of your repository. -->
<!--- You can find both of these in the url bar when you open your repository in github. -->

## 📙 Description

A conversational bot(Nana Adwoa) allowing users to book days with available slots to take covid vaccine.

## 💡 Motivation and Context

<!--- Describe your app in one or two sentences -->

COVID-19 infections are increasing in Ghana, with 420 new infections reported on average each day. That's 54% of the peak — the highest daily average reported on July 28. During the last week reported, Ghana averaged about 719 doses administered each day. At that rate, it will take a further 8,460 days to administer enough doses for another 10% of the population.

As taking Vaccines is still in progress, most of the population are busy and would find it difficult going to join long queues to take Vaccines Shot. Even though their health is important, the quality of health service they get also depends on the amount of money they make as such the decision of leaving work for the vaccination becomes difficult to make.

Not only are most people also busy but due to social distancing regulations and safety reasons, people feel afraid of joining long queues or waiting several hours at vaccination spots or centers where it would be easy for them to take shots if they know exactly the time to come for the vaccine.

The solution here is simple, a simple conversational assistant or chat bot integrated into all the health service web platforms and also can be deployed as a telephony system where people can book days available for people to take their vaccines shots and schedule the second shot day. In a day, there are a number of shots and number of people who can take. This will prevent long queues and give people the comfort to take the vaccines and keep everyone Safe.
For integrations, a custom integration will be made for web to allow it to be easily embedded on health service websites.

# ⚙️ Getting Started

To run this project locally, you need to create a service account for the agent

- Clone the project `https://github.com/botchway44/covid-vaccine-appointment.git`
- Create an environmental variable (.env file) in the root directory of the project - use [.env.default](https://github.com/botchway44/covid-vaccine-appointment/blob/main/.env.default) as a template
- Create a mongo database for the project, obtain a [connection string](https://docs.mongodb.com/manual/reference/connection-string/) and update the .env file with the [connection string](https://docs.mongodb.com/manual/reference/connection-string)
- Create a [service account](https://cloud.google.com/dialogflow/cx/docs/quick/setup) and from the json file update these fields in your .env file

---

| Key               | Description                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| AGENT_ID          | The agent id of the project. Instructions below in getting the agent id                                                     |
| DF_PROJECT_ID     | The project id in the service json file                                                                                     |
| DF_PRIVATE_KEY    | The peivate key in the service json file                                                                                    |
| DF_PRIVATE_KEY_ID | The private key id in the service json file                                                                                 |
| DF_CLIENT_EMAIL   | The client email in the service json file                                                                                   |
| MONGODB_URL       | A mongodb [connection string](https://cloud.google.com/dialogflow/cx/docs/quick/setup)                                      |
| GMAIL             | The Email to be used by the SMTP Service `MailerService`. Check the guide Extra section to see how to setup Gmail for that. |
| GMAIL_PASS        | The provided Gmail password                                                                                                 |

<br>

---

- run `npm install`
- run `npm run start:dev`
- locate the project on `http://localhost:9000/dev.html`

<br>

## Importing Agent to the DialogflowCX console

- Open the dialogflow cx console and create a new project and follow the guide to [restore/import the agent.](https://cloud.google.com/dialogflow/cx/docs/concept/agent#export)

## Updating the Webhook from DialogflowCX console

You can use [ngrok](https://ngrok.com/docs) or [localtunnel](https://github.com/localtunnel/localtunnel) to expose the webhook to the internet. After exporting the port `9000` you can update the webhook in the DialogflowCX console.

- Open the DialogflowCX console and click on the Manage tab
- Select Webhooks and from the created webhook with the name fulfillment, update it to the generated address.

![image](https://user-images.githubusercontent.com/16451643/131264362-c6421f79-9323-4e0f-a95f-44d7926c137c.png)

<br>

## Updating the agent id

The last step is to update the agent id in the chat component to the agent id of your project. You can find the agent id in the url bar when you open your project in dialogflow CX console or in the all agents page of the CX console.

Click on the Kebab menu closer to the agent name
![Screenshot (38)_LI](https://user-images.githubusercontent.com/16451643/131257205-99a32bc3-4cba-4bea-bc75-c0cb72051882.jpg)

---

Select Copy name and paste in any editor. Your agent id comes after the agents
![image](https://user-images.githubusercontent.com/16451643/131258295-354d8997-4d9c-46b6-b2c1-02732ba0bfa0.png)

Replace the agent id and webhook url in the chat component.

```html
<dialogflowcx-chat-widget
  chat-title="Vaccine Appointments"
  agent-id="replace-with-your-agent-id"
  agent-url="/channels/web"
>
</dialogflowcx-chat-widget>

<!-- FYI 
1. if you want to attach the widget on a custom site, 
replace the agent-url with the domain of the server 
you hosted the project on then append /channels/web 

2. Make sure to use us-central1 for the project location
-->
```

# Extra

A few resources and guides when setting this project up

- [Dialogflow CX Console overview](https://cloud.google.com/dialogflow/cx/docs/concept/console)

- Guide on obtaining [Google Service Account](https://cloud.google.com/dialogflow/cx/docs/quick/setup)
- Guide on setting up Nodemailer with [Google Account](https://mailtrap.io/blog/nodemailer-gmail/)
- Guide on Setting up [MongoDB on ATLAS](https://studio3t.com/knowledge-base/articles/mongodb-atlas-tutorial/) to obtain connection string
