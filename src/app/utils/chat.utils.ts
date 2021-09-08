import {
    Chat,
    Chip,
    ChipMessage,
    IChat,
    ImageMessage,
    IMedia,
    ListItem,
    ListMessage,
}
from "../../models/chat.model";
const {struct} = require('pb-util');

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
        else {

        const decoded : IChat = struct.decode(message.payload);
            // if type is chips
            if (decoded.messageType === "MENU_CHIPS") {
                const _payload = decoded.payload as Chip[];
                const _message = new ChipMessage(decoded.messageType, _payload);
                chats.push(_message);
            }
            else if (decoded.messageType === "IMAGE") {
                const _payload = decoded.payload as IMedia[];
                const _message = new ImageMessage(decoded.messageType, _payload);
                chats.push(_message);
            }
            else if (decoded.messageType === "LIST") {
                const _payload = decoded.payload as ListItem[];
                const _message = new ListMessage(decoded.messageType, _payload);
                chats.push(_message);
            } 
        }
    }
    return chats;
}
 
