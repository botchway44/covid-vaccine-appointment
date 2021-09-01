
import { chatImageTemplate } from './assets';
import { IChat, IMedia } from '../models/chat.model';


export class ChatImageWidgetElement extends HTMLElement {
  private domInitialized = false;
  private chat: IChat;
  private imagesContainer: HTMLElement
  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {
    return [''];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatImageTemplate.content.cloneNode(true));

    // get the message element and append message
    this.imagesContainer = this.shadowRoot.querySelector(".chat-widget-image-container");
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

    // create spans and add to chips frame
    const chips = this.chat.payload as IMedia[];


    for (const item of chips) {
      const element = this.createImageElement(item);
      element.classList.add("popup-chat");
      element.classList.add("image");

      // add to the chips frame
      this.imagesContainer.appendChild(element);
    }
  }


  protected createImageElement(media: IMedia): HTMLImageElement {
    const element = document.createElement("img");
    element.src = media.url;

    return element;
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.hasAttribute(name)) {
      newValue = null;
    }

    this.setOrRemoveAttribute(name, newValue)
  }

  protected setOrRemoveAttribute(name: string, value: string) {
    if (value == null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }
}
