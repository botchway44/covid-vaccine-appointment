import { REQUEST_TYPE } from "./chat.model";



export interface LOCATION_REQUEST {
    latitude: number;
    longitude: number;
    query: string;
    intentQuery: string;
}
export interface IIntentRequest {
    projectId: string;
    location: string;
    agentId: string;
    query: string | LOCATION_REQUEST;
    languageCode: string;
    sessionId: string;

    channel: string;

    requestType?: REQUEST_TYPE;
}

export class IntentRequest implements IIntentRequest {



    constructor(
        public projectId: string,
        public location: string,
        public agentId: string,
        public languageCode: string,
        public sessionId: string,
        public query: string | LOCATION_REQUEST,

    ) {


    }


    requestType: REQUEST_TYPE = "TEXT";
    channel: string = "WEB"//WEB
}