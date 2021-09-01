
import { chatInputTemplate } from './assets';


export class ChatInputWidgetElement extends HTMLElement {
  private domInitialized = false;

  protected chatState: boolean = false
  protected chatToggleButton: HTMLButtonElement;
  protected chatInputBox: HTMLInputElement;
  protected sendButton: HTMLButtonElement;

  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {
    return [''];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatInputTemplate.content.cloneNode(true));

    // Register/Bind event listeners to prevent null
    this._handleEnterKeyPressed = this._handleEnterKeyPressed.bind(this);
    this._handleSendButtonPressed = this._handleSendButtonPressed.bind(this);

    // Select Elements from html
    this.chatInputBox = this.shadowRoot.querySelector('.chat-input-box');
    this.sendButton = this.shadowRoot.querySelector('.send-button');

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
    this.chatInputBox.addEventListener("keydown", this._handleEnterKeyPressed);
    this.sendButton.addEventListener("click", this._handleSendButtonPressed);
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (!this.hasAttribute(name)) {
      newValue = null;
    }
  }

  protected _handleEnterKeyPressed(_event: any) {

    this.emitScrollToBottom();

    if (_event.key === "Enter" && this.chatInputBox.value.length > 0) {

      this.emitSendMessageEvent(this.chatInputBox.value);
      this.chatInputBox.value = ""
    }
  }

  protected _handleSendButtonPressed(_event: any) {

    this.emitScrollToBottom();

    if (this.chatInputBox.value.length > 0) {

      this.emitSendMessageEvent(this.chatInputBox.value);
      this.chatInputBox.value = ""
    }
  }

  emitSendMessageEvent(value: string) {
    const event = new CustomEvent("queryEntered", {
      detail: {
        message: value
      }
    });

    // Dispatch an event to the GLobal scope to be handled by the send chat frame
    window.dispatchEvent(event);
  }

  emitScrollToBottom() {
    const event = new CustomEvent("scrollToView");

    // Dispatch an event to the GLobal scope to be handled by the send chat frame
    window.dispatchEvent(event);
  }
  protected setOrRemoveAttribute(name: string, value: string) {
    if (value == null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }
}
