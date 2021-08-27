export class Social {

    constructor() { }



    getStarted(req:any, resp:any) { }

   static resetAppointment(req: any, resp: any) {
          return{
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
                      
            };
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
                    user_id: "john Doe"
                }
            };

    }
}