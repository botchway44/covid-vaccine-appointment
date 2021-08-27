import { IAppointment } from "../../models/appointment";

export class Social {

    constructor() { }



    static getStarted(req: any, resp: any, ssid : string) {
      return{
                        
                sessionInfo: {
                    parameters: {                         
                        sessionId: ssid,
                        email: null,
                        verified : "false"
                    }
                }

            };
   }

    static createAppointment(req: any, resp: any, verified: boolean, appointment : IAppointment) {
        if (verified) {
            // send verified payload
            return{
                        
                sessionInfo: {
                  parameters: {
                         ...req.body.sessionInfo.parameters,
                        email: appointment.email,
                        location: appointment.location,
                        quantity: appointment.quantity,
                        date: appointment.date,
                        time : appointment.time,
                    }
                }

            };
        }

         return{
                        
                sessionInfo: {
                  parameters: {
                         ...req.body.sessionInfo.parameters,
                        email: appointment.email,
                        location: appointment.location,
                        quantity: appointment.quantity,
                        date: appointment.date,
                        time : appointment.time,
                    }
                }

            };
    }
   static resetAppointment(req: any, resp: any) {
          return{
                sessionInfo: {
                  parameters: {
                         ...req.body.sessionInfo.parameters,
                        email: null,
                        verified : "false"
                    }
                }
            };
    }

    static emailRouteNavigation(req: any, resp: any, verified : boolean) {

        if (!verified) {
            return {
                target_page: "projects/stanbic-assistant/locations/us-central1/agents/4883adeb-8d80-4383-8c3f-db6308741731/flows/00000000-0000-0000-0000-000000000000/pages/cb212e63-9808-4446-96ba-438c54058797",
       
                sessionInfo: {
                    parameters: {
                        ...req.body.sessionInfo.parameters,
                    }
                }
                        
            }
        }

        const email = req.body.sessionInfo.parameters.email;
        return {
            fulfillment_response: {
                messages: [
                    ,
                    {
                        text: {
                            //fulfillment text response to be sent to the agent
                            text: [`Do you want to use ${email} for the appointment ?`]
                        }
                    },
                    {
                    "payload": [
                        {
                        "text": "yes",
                        "id": 1
                        },
                        {
                        "id": 2,
                        "text": "no"
                        },
                        {
                        "text": "Check appointment",
                        "id": 2
                        }
                    ],
                    "messageType": "MENU_CHIPS"
                    }
                ]
            },
        }
    }
    static verifyEmail(req: any, resp: any, verified : boolean) {
         const email = req.body.sessionInfo.parameters.email;

        if (verified) {
            return {
                    
                pageInfo: {
                    currentPage: req.body.pageInfo.formInfo.parameterInfo.currentPage,
                    formInfo: {
                        parameterInfo: [
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
                    session: req.body.sessionInfo.session,
                    parameters: {
                        ...req.body.sessionInfo.parameters,
                        email: email,
                        verified: "false"
                    }
                }
                          
            }
        }


            return{
                fulfillment_response: {
                    messages: [
                        {
                            text: {
                                //fulfillment text response to be sent to the agent
                                text: ["I had a problem verifying your email, Please try again."]
                            }
                        }
                    ]
                },
                pageInfo: {
                    currentPage: req.body.pageInfo.formInfo.parameterInfo.currentPage,
                    formInfo: {
                        parameterInfo: [
                            {
                                displayName: 'email',
                                required: true,
                                state: 'EMPTY',
                                value: email,
                                justCollected: true
                            },
                            { displayName: 'verified', state: 'FILLED', value: 'false' }
                        ]
                    }
                },
                sessionInfo: {
                    session: req.body.sessionInfo.session,
                    parameters: {
                         ...req.body.sessionInfo.parameters,
                        email: email,
                        verified: "false"
                    }
                }
                          
            };

    }

    static verifyCode(req: any, resp: any, verified: boolean) {
           if(verified){
            // send verified payload
            return {
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
                              { displayName: 'verified', state: 'FILLED', value: 'true' }

                             ]
                             },
                        sessionInfo: {
                            parameters: {                         
                                ...req.body.sessionInfo.parameters,
                                verified : "true"
                            }
                        }
                        
                },   
            }
        }
        
           return {
                   fulfillment_response: { 
                    messages: [
                        {
                            text: {
                                //fulfillment text response to be sent to the agent
                                text: ["Verification failed. Please try again"]
                            }
                        }
                ] 
                }, 
                pageInfo:{
                        formInfo : { 
                            parameterInfo :  [
                                {
                                    displayName: 'code',
                                    required: true,
                                    state: 'EMPTY',
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
        }
        
    }

    static default(req: any, resp: any) {

        
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
                     ...req.body.sessionInfo.parameters,
                }
            };

    }

   static checkAppointment(req: any, resp: any, appointment : (IAppointment | null)) {
        if(appointment){
            return {
                sessionInfo: {
                    session: req.body.sessionInfo.session,
                    parameters: {
                        ...req.body.sessionInfo.parameters,
                        email: appointment.email,
                        location: appointment.location,
                        quantity: appointment.quantity,
                        date: appointment.date,
                        time: appointment.time,
                        verified: "true"
                    }
                }
            }
        }

        return {
            fulfillment_response: {
                messages: [
                    {
                        text: {
                            //fulfillment text response to be sent to the agent
                            text: ["I had a problem checking your appointment, Please try again."]
                        }
                    }
                ]
            },
            sessionInfo: {
                session: req.body.sessionInfo.session,
                parameters: {
                    ...req.body.sessionInfo.parameters,
                }
            }
        }

    }

    static resendCode(req: any, resp: any) {
        return  {
            fulfillment_response: {
                messages: [
                    {
                        text: {
                            //fulfillment text response to be sent to the agent
                            text: ["A new code has been sent to your email."]
                        }
                    }
                ]
            },
            sessionInfo: {
                session: req.body.sessionInfo.session,
                parameters: {
                    ...req.body.sessionInfo.parameters,
                }
            }
        }
    }
}