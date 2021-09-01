
import { chatFrameTemplate } from './assets';
import { Chat, IChat } from '../models/chat.model';
import {  IntentRequest,LOCATION_REQUEST  } from '../models/IntentRequest';



/**
 * Dialogflow Eva chat widget
 * Interacts with a custom Dialog interactions API.
 *
 * The element supports styling using the CSS [`::part` syntax](https://developer.mozilla.org/docs/Web/CSS/::part)
 * (see the list of shadow parts [below](#css-shadow-parts)). For example:
 * ```css
 * dialogflow-chat-widget::part(chat-main-wrapper) {
 *     background: aquamarine;
 *     border-radius: 0px;
 * }
 * ```
 *
 * @prop agent-url - The URL of the custom interactions api. Not null but bby defualt will use localhost
 * @prop agent-id - The dialogflow agent id. Not null but ny default uses a test agent id
 * @prop chat-title - The title of the chat component
 * @prop session-id - The unique identifier to manage sessions. This is created by default if null 

 * @listen queryEntered - The input has a query and the enter key has pressed
 * @listens scrollToView - The view has been called to scroll down
 * @listens collapseChat - The minize chat button has been pressed on mobile in the chat frame
 * @listens chipSelected - One of the chips is selected
 *
 * @csspart chat-main-wrapper - `<section>` containing all the chatss - Chats Frame
 * @csspart chat-toggle-btn - The message button in the view that toggles the chat frame on/ off
 * @csspart chat-main-wrapper <section> - Numeric time indicator
 * @csspart chat-loading - the loading indicator for the loading eva chats
 * @csspart chat_button_container p - The text suggesstion for eva chats
 */
export class ChatWidgetElement extends HTMLElement {
  private domInitialized = false;
  protected chatState: boolean = false;
  protected chatSuggesstionDirty: boolean = false;

  protected sessionId: string;
  protected intentUrl: string;
  protected intentRequest: IntentRequest;
  protected chats: IChat[] = [];

  protected chatToggleButton: HTMLButtonElement;
  protected chatViewFrame: HTMLElement;
  protected chatListFrame: HTMLElement;
  protected loadingElement: HTMLElement;
  protected chatSuggesstionElement: HTMLElement;


  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {

    return [''];
  }


  constructor() {
    super();

    // create sessionId to manange chats
    this.sessionId = Math.random().toString(36).substring(7);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatFrameTemplate.content.cloneNode(true));

    this.toggleChatViewState = this.toggleChatViewState.bind(this);


    this.chatViewFrame = this.shadowRoot.querySelector('.chat-main-wrapper ')
    this.chatToggleButton = this.shadowRoot.querySelector('.chat-toggle-btn');
    this.chatListFrame = this.shadowRoot.querySelector('.chat-main-wrapper div');
    this.loadingElement = this.shadowRoot.querySelector('.chat-loading');
    this.chatSuggesstionElement = this.shadowRoot.querySelector('.chat_button_container p');


  }

  connectedCallback() {
    if (this.domInitialized) {
      return;
    }
    this.domInitialized = true;

    const applyFocusVisiblePolyfill =
      (window as any).applyFocusVisiblePolyfill as (scope: Document | ShadowRoot) => void;
    if (applyFocusVisiblePolyfill != null) {
      applyFocusVisiblePolyfill(this.shadowRoot);
    }

    // Get intent URL
    this.intentUrl = this.getAttribute("agent-url") || "http://localhost:2000/interactions/api";
    const agentId = this.getAttribute("agent-id") ;
    const chatTitle = this.getAttribute("chat-title") || "Virtual Chat";

    if (chatTitle) {
      // query chat title and change to new one
      const header = this.shadowRoot.querySelector("chat-header-widget");
      header.setAttribute("chat-title", chatTitle);
    }

    this.hideChatLoader();

    // create an intentRequest
    this.intentRequest = new IntentRequest(
      "stanbic-assistant",
      "us-central1",
      agentId,
      "en",
      this.sessionId,
      "hello"
    );




    this.chatToggleButton.addEventListener("click", this.toggleChatViewState)

    // init chat
    //@ts-ignore
    window.addEventListener("queryEntered", (event: CustomEvent) => {

      const message = event.detail.message;
      const chat = new Chat(message, this.sessionId, "USER");

      this.addChat(chat);


      // show that a mssage request is sent
      this.showChatLoader();

      // scoll to the bottom
      this.scrollToView()

      // set the chat message to the intent request and validate
      this.intentRequest.query = chat.text;
      this.intentRequest.requestType = "TEXT";

      this.verifyIntents(this.intentRequest);
    });


    // Listen to chat collapsedon Mobile
    window.addEventListener("collapseChat", (_event) => {
      this.hideChatFrame()
    })

    // Listen to scroll to the bottom
    window.addEventListener("scrollToView", () => {
      this.scrollToView();

    });

    // Listen to chip selected
    // TODO: PULL ALL EVENT NAMES INTO TYPES FOR EASY REFERNCE
    //@ts-ignore
    window.addEventListener("chipSelected", (event: CustomEvent) => {
      // retrieve custom data
      const message = event.detail.message;
      // const id = event.detail.id;

      // find the element

      // create chat and append
      const chat = new Chat(message, this.sessionId, "USER");
      this.addChat(chat);

      this.showChatLoader();

      // scoll to the bottom
      this.scrollToView()

      // set the chat message to the intent request and validate
      this.intentRequest.query = message;
      this.intentRequest.requestType = "TEXT";

      this.verifyIntents(this.intentRequest);
    });

    // Listen to chip selected
    //@ts-ignore
    window.addEventListener("locationSelected", (event: CustomEvent) => {
      // retrieve custom data
      const message = event.detail as LOCATION_REQUEST;
      // const id = event.detail.id;

      // find the element

      // create chat and append
      const chat = new Chat(message.query, this.sessionId, "USER");
      this.addChat(chat);

      this.showChatLoader();

      // scoll to the bottom
      this.scrollToView()

      // set the chat message to the intent request and validate
      
      this.intentRequest.query = message;
      this.intentRequest.requestType = "LOCATION";

      this.verifyIntents(this.intentRequest);
    });


    // Listen to locationPickerError
    //@ts-ignore
    window.addEventListener("locationPickerError", (event: CustomEvent) => {
      // retrieve custom data
      const message = event.detail.message;

      // create chat and append
      const chat = new Chat(message, this.sessionId, "BOT");
      this.addChat(chat);

    });

    // Listen for chat suggesstion chip clicked
    this.chatSuggesstionElement.addEventListener("click", (_event) => {

      // verify if the chat is closed
      if (!this.chatState && !this.chatSuggesstionDirty) {
        // open
        this.showChatFrame();

      } else {
        // just open
        this.showChatFrame();
      }

      this.chatSuggesstionDirty = true;

    });


    // Listen to chip selected
    //@ts-ignore
    window.addEventListener("chatLoaderToggled", (event: CustomEvent) => {
      // retrieve custom data
      const message = event.detail as { state: boolean };
      if (message.state) {
        this.showChatLoader();
      } else {
        this.hideChatLoader();
      }
    } ) ;


    // hide chat loader
    this.hideChatLoader();

    this.hideChatFrame();

    this.loadInitialChat();
  }


  protected toggleChatViewState(_event: any) {
    this.chatState = !this.chatState;

    // const chatViewFrame = this.shadowRoot.querySelector('.chat-main-wrapper')


    if (this.chatState) {
      this.showChatFrame()
    } else {
      this.hideChatFrame()
    }


  }

  protected hideChatFrame(): void {
    // Show up the chat view
    this.chatViewFrame.style.display = "none";

    // hide chat suggesstion chips
    this.chatSuggesstionElement.style.display = "block";
    if (this.chatSuggesstionDirty) {
      this.chatSuggesstionElement.textContent = "Have any questions ?"
    }


    // hide chat button
    // this.chatToggleButton.style.display = "flex";
    const elem = this.shadowRoot.querySelector('.chat_button_container') as HTMLElement;
    elem.style.display = "flex";
  }

  protected showChatFrame(): void {
    // Show up the chat view
    this.chatViewFrame.style.display = "flex";


    // hide chat suggesstion chips
    this.chatSuggesstionElement.style.display = "none";

    // Scroll to the bottom
    this.scrollToView()

    // hide chat button
    // this.chatToggleButton.style.display = "none";
    const elem = this.shadowRoot.querySelector('.chat_button_container') as HTMLElement;
    elem.style.display = "none";
  }

  protected addChat(chat: IChat) {

    // if chat is a users chat, create a users component
    if (chat.chatType === "USER") {
      // create user widget
      const element = document.createElement("chat-user-widget");
      element.setAttribute("chat", JSON.stringify(chat))

      this.chatListFrame.appendChild(element);
    } else if (chat.chatType === "BOT") {
      // create user widget
      const element = document.createElement("chat-bot-widget");
      element.classList.add("popup-chat");
      element.setAttribute("chat", JSON.stringify(chat))

      this.chatListFrame.appendChild(element);
    } else if (chat.messageType === "CHIPS") {
      const element = document.createElement("chat-chips-widget");
      element.setAttribute("chat", JSON.stringify(chat))

      this.chatListFrame.appendChild(element);
    } 
    else if (chat.messageType === "IMAGE") {
      const element = document.createElement("chat-image-widget");
      element.setAttribute("chat", JSON.stringify(chat))

      this.chatListFrame.appendChild(element);
    }
    else if (chat.messageType === "MENU_CHIPS") {
      const element = document.createElement("chat-menu-chips-widget");
      element.setAttribute("chat", JSON.stringify(chat))
  
      this.chatListFrame.appendChild(element);
    } 
    else if (chat.messageType === "LIST") {
      // <chat-list-widget></chat-list-widget>
      const element = document.createElement("chat-list-widget");
      element.setAttribute("chat", JSON.stringify(chat))
      this.chatListFrame.appendChild(element);
    }
    // scoll into the bottom element
    this.scrollToView()
  }


  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.hasAttribute(name)) {
      newValue = null;
    }
  }


  protected showChatSuggesstionChip() {
    // chatSuggesstionDirty
  }

  protected hideChatSuggesstionChip() {

  }

  protected loadInitialChat() {
    // set message to hello for the first time
    this.intentRequest.query = "hello";
    this.intentRequest.requestType = "TEXT";

    this.showChatLoader()

    
    this.verifyIntents(this.intentRequest)
  }

  protected hideChatLoader() {
    this.loadingElement.style.display = 'none';
  }

  protected showChatLoader() {
    this.loadingElement.style.display = 'block';
  }


  protected scrollToView(): void {
    const trick = this.shadowRoot.querySelector(".trick-to-scroll-here");
    trick.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  protected setOrRemoveAttribute(name: string, value: string) {
    if (value == null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }



  async verifyIntents(intentRequest: IntentRequest) {

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', "application/json");

    const myInit: RequestInit = {
      method: 'post',
      headers: myHeaders,
      body: JSON.stringify(intentRequest), // body data type must match "Content-Type" header
      mode: 'cors'
    };

    let myRequest = new Request(this.intentUrl, myInit);

    try {
      const response = await fetch(
        myRequest
      );

      this.hideChatLoader();

      //TODO :  Handle responses well
      if (!response.ok) {
        // falied
        this.addChat(new Chat("I had a problem getting results, please try again", this.sessionId, "BOT"));
      }

      const data = await response.json();

      if (data) {
        // add them to the chatList
        for (const chat of data) {
          this.addChat(chat);
        }
      }

    }
    catch (e) {
      this.hideChatLoader();
      this.addChat(new Chat("I had a problem getting results, please try again", this.sessionId, "BOT"));
    }

    finally {
      this.hideChatLoader();
    }
  }
}