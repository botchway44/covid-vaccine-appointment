
import { chatBotTemplate } from './assets';
import { IChat } from '../models/chat.model';


export class ChatBotWidgetElement extends HTMLElement {
  private domInitialized = false;
  private chat: IChat;
  private messageContainer: HTMLElement
  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {
    return [''];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatBotTemplate.content.cloneNode(true));

    // get the message element and append message
    this.messageContainer = this.shadowRoot.querySelector("p");
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
    this.messageContainer.innerHTML = this.chat.text;

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
