# Covid Vaccine Appointment ChatBot

<!--- Replace <OWNER> with your Github Username and <REPOSITORY> with the name of your repository. -->
<!--- You can find both of these in the url bar when you open your repository in github. -->

## 📙 Description

A conversational bot(Nana Adwoa) allowing users to book days with available slots to take covid vaccine.

## Demo

Check out our website for a live [demo](https://dfcx-vaccine-appointment.herokuapp.com/)


## 💡 Motivation and Context
 
<!--- Describe your app in one or two sentences -->

COVID-19 infections are increasing in Ghana, with 420 new infections reported on average each day. That's 54% of the peak — the highest daily average reported on July 28. During the last week reported, Ghana averaged about 719 doses administered each day. At that rate, it will take a further 8,460 days to administer enough doses for another 10% of the population. [Source](https://graphics.reuters.com/world-coronavirus-tracker-and-maps/countries-and-territories/ghana/)

As taking Vaccines is still in progress, most of the population are busy and would find it difficult going to join long queues to take Vaccines Shot. Even though their health is important, the quality of health service they get also depends on the amount of money they make as such the decision of leaving work for the vaccination becomes difficult to make.

The solution here is simple, a simple conversational assistant or chat bot integrated into all the health service web platforms and also can be deployed as a telephony system where people can book days available for people to take their vaccines shots and schedule the second shot day. [READ MORE](https://github.com/botchway44/covid-vaccine-appointment/blob/main/PROJECT.md)

## ⚙️ Getting Started

This project is configured to run both the [chat widget](https://github.com/botchway44/covid-vaccine-appointment/tree/main/src/widget) and an [express application](https://github.com/botchway44/covid-vaccine-appointment/tree/main/src/app) together. It bundles the chat widget into a single js file in the [dist folder]()

- **[assets](https://github.com/botchway44/covid-vaccine-appointment/tree/main/assets)** - Contains static shared assets like images, fonts & svgs for the projects
- **[cx-model](https://github.com/botchway44/covid-vaccine-appointment/tree/main/cx-model)** The exported dialogflow-cx agent
- **[src/app](https://github.com/botchway44/covid-vaccine-appointment/tree/main/src/app)** - Nodesjs server for detecting intents and handling fulfillments
- **[src/widget](https://github.com/botchway44/covid-vaccine-appointment/tree/main/src/widget)** - Web component written in typescript and uses rollup to bundle into minifies js files with `npm run build:widget` command.
- **[src/model](https://github.com/botchway44/covid-vaccine-appointment/tree/main/src/models)** - Contains the shared model for the project

For a detailed instruction on running this project locally, [click here](https://github.com/botchway44/covid-vaccine-appointment/blob/main/PROJECT.md#%EF%B8%8F-getting-started)

<!-- ## :bulb: Motivation and Context
Dialogflow CX Competition -->
<!--- What are you especially proud of? -->

## 📸 Screenshots

<img src="assets/images/ss.png"/>

| 1                                            | 2                                            |
| -------------------------------------------- | -------------------------------------------- |
| <img src="assets/images/s1.png" width="400"> | <img src="assets/images/s2.png" width="400"> |

| 3                                            | 4                                            |
| -------------------------------------------- | -------------------------------------------- |
| <img src="assets/images/s3.png" width="400"> | <img src="assets/images/s4.png" width="400"> |

## Built with

- Dialogflow CX
- Nodejs with Typescript
- MongoDB

## Credits

- Bot conversation video created with [Synthesia](https://www.synthesia.io/request-demo)
- Email templates design created with [Designmodo](https://designmodo.com/postcards/)

## License

See [LICENSE](https://github.com/botchway44/covid-vaccine-appointment/blob/main/LICENSE).
