

export type CHAT_TEXT_TYPE = 'TEXT'
export type CHAT_CHIPS = "CHIPS";
export type CHAT_MESSAGE_TYPE = CHAT_CHIPS | "TEXT" | "IMAGE" | "RICHCHIPS" | "LOCATION_PICKER" | "LOCATION_PICKER_BRANCH" | "LOCATION_PICKER_ATM" | "LIST";


export type CHAT_USER = "USER";
export type CHAT_BOT = "BOT";


// TODO : Fix this
export type CHAT_TYPE = CHAT_USER | CHAT_BOT | CHAT_CHIPS | "IMAGE" | "RICHCHIPS" | "LIST" | "LOCATION_PICKER" | "LOCATION_PICKER_BRANCH" | "LOCATION_PICKER_ATM";


export type CHAT_CLOSED = false;
export type CHAT_OPEN = true;
export type CHAT_STATE = CHAT_OPEN | CHAT_CLOSED;

export interface MessageItem {
  id?: string
  text?: string
  heading?: string
  subheading?: string
  url?: string
  imageUrl?: string

}

export class Chip implements MessageItem {

  constructor(
    public id: string,
    public text: string
  ) { }
}


export interface IList {

}
export interface IMedia {
  id: string
  url: string
}

export class Media implements MessageItem {
  constructor(
    public id: string,
    public url: string
  ) { }
}


export type PAYLOAD_TYPE = MessageItem[]; //if there are other types

export interface IChat {

  id?: string
  sessionId?: string
  text?: string
  messageType?: CHAT_MESSAGE_TYPE
  chatType?: CHAT_TYPE
  payload?: PAYLOAD_TYPE
}


export class Chat implements IChat {

  constructor(
    public text: string,
    public sessionId: string,
    public chatType: CHAT_TYPE
  ) {
    const uuid = Math.random().toString(36).substring(7);

    this.id = uuid;
  }

  public messageType: CHAT_MESSAGE_TYPE = "TEXT";
  public id: string
}

export class ChipMessage implements IChat {

  constructor(
    public messageType: CHAT_MESSAGE_TYPE,
    public payload: PAYLOAD_TYPE
  ) {
    const uuid = Math.random().toString(36).substring(7);

    this.id = uuid;
  }

  public chatType: CHAT_TYPE = "CHIPS";
  public id: string
}

export class RichChip implements MessageItem {

  constructor(
    public id: string,
    public text: string,
    public imageUrl: string,
    public url?: string
  ) { }

}


export class ImageMessage implements IChat {

  constructor(
    public messageType: CHAT_MESSAGE_TYPE,
    public payload: PAYLOAD_TYPE
  ) {
    const uuid = Math.random().toString(36).substring(7);

    this.id = uuid;
  }

  public chatType: CHAT_TYPE = "IMAGE";
  public id: string
}


export class ListItem implements MessageItem {

  constructor(
    public id: string,
    public heading: string,
    public subheading: string,
    public url: string,
    public latitude?: string,
    public longitude?: string
  ) { }

}

export class ListMessage implements IChat {

  constructor(
    public messageType: CHAT_MESSAGE_TYPE,
    public payload: PAYLOAD_TYPE
  ) {
    const uuid = Math.random().toString(36).substring(7);

    this.id = uuid;
  }

  public chatType: CHAT_TYPE = "LIST";
  public id: string;
}


// HANDLES INTENT REQUEST & LOCATION PICKER
export type REQUEST_TYPE = "LOCATION" | "TEXT";

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