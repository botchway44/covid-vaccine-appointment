
import { chatListTemplate, mapIconItem } from './assets';
import { IChat, ListItem } from '../models/chat.model';


export class ChatListWidgetElement extends HTMLElement {
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
    this.shadowRoot.appendChild(chatListTemplate.content.cloneNode(true));

    // get the message element and append message
    this.chipsContainer = this.shadowRoot.querySelector(".chat-widget-list-container");
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
    const _listItems = this.chat.payload as ListItem[];

    // const listITem: ListItem[] = [
    //   {
    //     id: "",
    //     heading: "List Item 1",
    //     subheading: "Subheading 1",
    //     url: "https://www.google.com"
    //   },
    //   {
    //     id: "",
    //     heading: "List Item 2",
    //     subheading: "Subheading 1",
    //     url: "https://www.google.com"
    //   }
    // ]

    for (const item of _listItems) {
      const element = this.createChipElement(item);

      //TODO: add event listener
      element.addEventListener("click", (_event) => {
        // const _elem = _event.target as HTMLElement;
        // TODO : LAter fix this  - find text differently
        // this.emitChipSelectedEvent(_elem.textContent, this.chat.id);

        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`;

        open(item.url, 'Window Test', params);
      })
      // add to the chips frame
      this.chipsContainer.appendChild(element);
    }
  }


  protected createChipElement(item: ListItem): HTMLElement {

    const template =
      `
     <div class="info">
        <h5 class="heading">${item.heading}</h5>
        <p class="subheading">
        ${item.subheading}
        </p>
      </div>

      <div class="icon">${mapIconItem}</div>
    `
    const element = document.createElement("section");
    // element.classList.add("chat-widget-list-container");
    element.innerHTML = template;

    // TODO : Handle click
    // element.querySelector('heading').textContent = item.heading;

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

  }

  protected setOrRemoveAttribute(name: string, value: string) {
    if (value == null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }
}
