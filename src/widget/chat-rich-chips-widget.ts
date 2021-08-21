
import { chatRichChipsTemplate } from './assets';
import { IChat, MessageItem } from '../models/chat.model';


export class ChatRichChipsWidgetElement extends HTMLElement {
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
    this.shadowRoot.appendChild(chatRichChipsTemplate.content.cloneNode(true));



    // get the message element and append message
    this.chipsContainer = this.shadowRoot.querySelector(".chat-widget-chip-container");


    // this.message = JSON.parse(this.getAttribute("data"));
    this.chat = JSON.parse(this.getAttribute("chat"));

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

    // create spans and add to chips frame
    const chips = this.chat.payload as MessageItem[];

    for (const item of chips) {
      const element = this.createRichChipElement(item);

      // add event listener
      element.querySelector("div").addEventListener("click", (_event) => {
        const _elem = _event.target as HTMLElement;

        const query = _elem.textContent;

        // TODO : LAter fix this  - find text differently
        this.emitChipSelectedEvent(query, this.chat.id);
      });

      // add to the chips frame
      this.chipsContainer.appendChild(element);
    }
  }


  protected createRichChipElement(chip: MessageItem): HTMLElement {
    const element = document.createElement("section");
    element.classList.add("popup-chat");
    element.classList.add("chat-widget-message-container");

    const textElem = document.createElement("div");
    textElem.textContent = chip.text;

    const imgElem = document.createElement("img");
    imgElem.src = chip.imageUrl;

    element.appendChild(imgElem);
    element.appendChild(textElem);

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
