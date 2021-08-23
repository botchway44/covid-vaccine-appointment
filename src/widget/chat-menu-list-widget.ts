import { chatMenuListTemplate } from './assets';
import { IChat, MessageItem } from '../models/chat.model';


export class ChatMenuListWidgetElement extends HTMLElement {
  private domInitialized = false;
  private chat: IChat;
  private chipsContainer: HTMLElement
  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {
    return [''];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatMenuListTemplate.content.cloneNode(true));


    // this.message = JSON.parse(this.getAttribute("data"));
    // this.chat = JSON.parse(this.getAttribute("message"));

    // get the message element and append message
    this.chipsContainer = this.shadowRoot.querySelector(".chat-widget-list-container ol");
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

    // Add Listeners if there are any
    // this.message = JSON.parse(this.getAttribute("data"));
    this.chat = JSON.parse(this.getAttribute("chat"));
    // this.chipsContainer.textContent = this.chat.text;

    // create spans and add to chips frame
    const _listItems = this.chat.payload as MessageItem[] ;

    console.log(_listItems);
    
    // const listITems: MessageItem[] = [
    //   {
    //     id: "",
    //     text: "Another Item",
    //   },
    //   {
    //     id: "",
    //     text: "Another New Item",
    //   }
      
    // ]


    for (const item of _listItems) {
      const element = this.createListItem(item);

      //TODO: add event listener
      element.addEventListener("click", (_event) => {
        // const _elem = _event.target as HTMLElement;
        // TODO : LAter fix this  - find text differently
        this.emitChipSelectedEvent(item.text, this.chat.id);
 
      });

      this.chipsContainer.appendChild(element);
    }
  }


  protected createListItem(item: MessageItem): HTMLElement {
 
    const element = document.createElement("li");
    element.classList.add("list-group-item");
    element.textContent = item.text;

    
    return element;
  }

  emitChipSelectedEvent(value: string, id: string) {
    const event = new CustomEvent("chipSelected", {
      detail: {
        message: value,
        id: id
      }
    });

    // Dispatch an event to the GLobal scope to be handled by the send chat frame
    window.dispatchEvent(event);
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.hasAttribute(name)) {
      newValue = null;
    }

    console.log(newValue);

  }

  protected setOrRemoveAttribute(name: string, value: string) {
    if (value == null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }
}
