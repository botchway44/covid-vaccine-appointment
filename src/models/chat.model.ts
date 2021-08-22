
export type CHAT_TEXT_TYPE = 'TEXT'
export type CHAT_CHIPS = "CHIPS";
export type CHAT_MESSAGE_TYPE = CHAT_CHIPS | "TEXT" | "IMAGE" | "RICHCHIPS" | "LOCATION_PICKER" | "LOCATION_PICKER_BRANCH" | "LOCATION_PICKER_ATM" | "LIST" | "MENU_LIST" | "MENU_CHIPS";
export type REQUEST_TYPE = "LOCATION" | "TEXT";


export type CHAT_USER = "USER";
export type CHAT_BOT = "BOT";


// TODO : Fix this
export type CHAT_TYPE = CHAT_USER | CHAT_BOT | CHAT_CHIPS | "IMAGE" | "RICHCHIPS" | "LIST" | "LOCATION_PICKER" | "LOCATION_PICKER_BRANCH" | "LOCATION_PICKER_ATM" | "MENU_LIST" | "MENU_CHIPS";


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

export interface LocationPicker{
  locationType : string;
  messageType?: CHAT_MESSAGE_TYPE
  chatType?: CHAT_TYPE
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
    public imageUrl? : string
    ) { }

  latitude?: string
  longitude?: string
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

