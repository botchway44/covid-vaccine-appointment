
import { chatChipsTemplate } from './assets';
import { IChat, MessageItem } from '../models/chat.model';


export class ChatChipsWidgetElement extends HTMLElement {
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
    this.shadowRoot.appendChild(chatChipsTemplate.content.cloneNode(true));

    // get the message element and append message
    this.chipsContainer = this.shadowRoot.querySelector(".chat-widget-chip-container");
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
    this.chat = JSON.parse(this.getAttribute("chat"));
    // this.chipsContainer.textContent = this.chat.text;

    // create spans and add to chips frame
    const chips = this.chat.payload as MessageItem[];

    for (const item of chips) {
      const element = this.createChipElement(item);

      // add event listener
      element.addEventListener("click", (_event) => {
        const _elem = _event.target as HTMLElement;

        // TODO : LAter fix this  - find text differently
        this.emitChipSelectedEvent(_elem.textContent, this.chat.id);
      })
      // add to the chips frame
      this.chipsContainer.appendChild(element);
    }
  }


  protected createChipElement(chip: MessageItem): HTMLElement {
    const element = document.createElement("span");
    element.classList.add("popup-chat");
    element.textContent = chip.text;

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
