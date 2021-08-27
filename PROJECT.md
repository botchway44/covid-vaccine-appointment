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
For integrations, a custom integration will be made for web to allow it to be easily embedded on websites. A custom one can also be made for mobile applications to allow easy integration into Mobile apps too if the time permit (Use case Flutter Framework).

## ⚙️ Getting Started

To run this project locally, you need to create a service account for the agent

- Clone the project `https://github.com/botchway44/covid-vaccine-appointment.git`
- Create an environmental variables (.env)
- Create a [service account](https://cloud.google.com/dialogflow/es/docs/quick/setup) and from the json file update these fields in your .env file

| Key               | Description                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| DF_PROJECT_ID     | The project id                                                                                                                    |
| DF_PRIVATE_KEY    |                                                                                                                                   |
| DF_PRIVATE_KEY_ID |                                                                                                                                   |
| DF_CLIENT_EMAIL   |                                                                                                                                   |
| MONGODB_URL       | A mongodb connection string,<br> eg. `mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]` |
| GMAIL             | The Email to be used by the SMTP Service `MailerService`. Check the guide Extra section to see how to setup Gmail for that.       |
| GMAIL_PASS        | The provided Gmail password                                                                                                       |

- run `npm install`
- run `npm run start:dev`
- locate the project on `http://localhost:9000/dev.html`

## Extra

- Guide on setting up Nodemailer with [Google Account](https://mailtrap.io/blog/nodemailer-gmail/)
