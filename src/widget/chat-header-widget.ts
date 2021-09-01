
import { chatHeaderTemplate } from './assets';


export class ChatHeaderWidgetElement extends HTMLElement {
  private domInitialized = false;

  protected chatState: boolean = false
  protected chatCollapseButton: HTMLElement;

  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {
    return [''];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatHeaderTemplate.content.cloneNode(true));

    // find the collapse arrow
    this.chatCollapseButton = this.shadowRoot.querySelector('.collapse-arrow');
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


    const chatTitle = this.getAttribute("chat-title") || "Virtual Chat";

    const title = this.shadowRoot.querySelector("h3");
    title.textContent = chatTitle;


    // Add Listeners if there are any
    this.chatCollapseButton.addEventListener("click", (_event) => {
      const event = new CustomEvent("collapseChat");


      // Dispatch an event to the GLobal scope to be handled by the send chat frame
      window.dispatchEvent(event);
    });
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
