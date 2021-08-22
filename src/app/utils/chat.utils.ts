import { Chat, CHAT_MESSAGE_TYPE, CHAT_TYPE, Chip, ChipMessage, IChat, ImageMessage, IMedia, ListItem, ListMessage, Media, MessageItem, RichChip } from "../../models/chat.model";

export function parseChat(response: any) {

    const chats: IChat[] = [];

    for (const message of response) {
        // If it is a text
        if (message.text) {

            const messagesText = message.text.text;

            if (messagesText.length > 0) {
                for (const text of messagesText) {
                    // get the text in the chat
                    const chat = new Chat(text, "BOT", "BOT");
                    chats.push(chat);
                }
            } else {
                const chat = new Chat("I dont have a response for this, please try again", "BOT", "BOT")
                chats.push(chat);

            }

        }
        // is a payload , TODO : Check type
        else {

            // if type is chips
            if (message.payload.fields.messageType.stringValue === "CHIPS") {

                const chips = parseChips(message,"CHIPS");
                chats.push(chips);
            }else if (message.payload.fields.messageType.stringValue === "MENU_LIST") {

                const chips = parseChips(message,"MENU_LIST");
                chats.push(chips);
            
            }else if (message.payload.fields.messageType.stringValue === "MENU_CHIPS") {

                const chips = parseChips(message,"MENU_CHIPS");
                chats.push(chips);
            }

            else if (message.payload.fields.messageType.stringValue === "RICHCHIPS") {
                chats.push(parseRichChips(message));

            }
            else if (message.payload.fields.messageType.stringValue === "IMAGE") {
                chats.push(parseImages(message));
            }
            else if (message.payload.fields.messageType.stringValue === "LIST") {
                chats.push(parseList(message));
            }
            else if (
                message.payload.fields.messageType.stringValue === "LOCATION_PICKER_BRANCH" ||
                message.payload.fields.messageType.stringValue === "LOCATION_PICKER_ATM"
            ) {
                chats.push(parseLocationPicker(message));
            }
        }
    }

    return chats;
}

export function parseImages(message: any) {
    const images: IMedia[] = [];
    const _images = message.payload.fields.payload.listValue.values;

    for (const chip of _images) {
        const newImage = new Media(
            chip.structValue.fields.id.numberValue,
            chip.structValue.fields.url.stringValue
        );

        images.push(newImage);
    }

    // create a new chip Message
    const imagesMessage = new ImageMessage("IMAGE", images);

    // add to messages list
    return imagesMessage;
}

export function parseList(message: any) {

    const lists: ListItem[] = [];
    const _list = message.payload.fields.payload.listValue.values;

    for (const item of _list) {
        const newList = new ListItem(
            item.structValue.fields.id.stringValue,
            item.structValue.fields.heading.stringValue,
            item.structValue.fields.subheading.stringValue,
            item.structValue.fields.url.stringValue,
            item.structValue.fields.imageUrl.stringValue
        );


        lists.push(newList);
    }

    const listMessage = new ListMessage("LIST", lists)

    return listMessage;
}

export function parseRichChips(message: any) {
    const chips: MessageItem[] = [];
    const _chips = message.payload.fields.payload.listValue.values;

    for (const chip of _chips) {
        const newChip = new RichChip(
            chip.structValue.fields.id.numberValue,
            chip.structValue.fields.text.stringValue,
            chip.structValue.fields.imageUrl.stringValue,
        );

        chips.push(newChip);
    }

    // create a new chip Message
    const chipMessage = new ChipMessage("RICHCHIPS", chips);

    // add to messages list
    return chipMessage;
}


export function parseChips(message: any, type : CHAT_MESSAGE_TYPE ) {
    const chips: MessageItem[] = [];
    const _chips = message.payload.fields.payload.listValue.values;

    for (const chip of _chips) {
        const newChip = new Chip(
            chip.structValue.fields.id.numberValue,
            chip.structValue.fields.text.stringValue
        );

        chips.push(newChip);
    }

    // create a new chip Message
    const chipMessage = new ChipMessage(type, chips);
    chipMessage.chatType = type as CHAT_TYPE ;

    // add to messages list
    return chipMessage;
}


export function parseLocationPicker(message : any){
    // const chats: IChat[] = [];
    console.log("LOCATION PICKER PARSER");

    const chatType = message.payload.fields.chatType.stringValue;

    // const locations = message.payload.fields.payload.listValue.values;
        console.log(message.payload);
  
    // return chipMessage;
    const chat = new Chat("", "", chatType);
    chat.messageType = chatType;

    return chat;
}