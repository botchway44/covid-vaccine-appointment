import { ChatLocationPickerWidgetElement } from './chat-location-picker-widget';
import { ChatHeaderWidgetElement } from './chat-header-widget';
import { ChatLoaderWidgetElement } from './chat-loader-widget';
import { ChatRichChipsWidgetElement } from './chat-rich-chips-widget';
import { ChatMenuChipsWidgetElement } from './chat-menu-chips-widget';
import { ChatMenuListWidgetElement } from './chat-menu-list-widget';
import { ChatInputWidgetElement } from './chat-input-widget';
import { ChatChipsWidgetElement } from './chat-chips-widget';
import { ChatImageWidgetElement } from './chat-image-widget';
import { ChatUserWidgetElement } from './chat-user-widget';
import { ChatListWidgetElement } from './chat-list-widget';
import { ChatBotWidgetElement } from './chat-bot-widget';
import { ChatWidgetElement } from './chat-widget';

export { ChatWidgetElement };

window.customElements.define('chat-location-picker-widget', ChatLocationPickerWidgetElement);
window.customElements.define('chat-rich-chips-widget', ChatRichChipsWidgetElement);
window.customElements.define('chat-menu-chips-widget', ChatMenuChipsWidgetElement);
window.customElements.define('chat-menu-list-widget', ChatMenuListWidgetElement);
window.customElements.define('chat-header-widget', ChatHeaderWidgetElement);
window.customElements.define('chat-loader-widget', ChatLoaderWidgetElement);
window.customElements.define('chat-image-widget', ChatImageWidgetElement);
window.customElements.define('chat-chips-widget', ChatChipsWidgetElement);
window.customElements.define('chat-input-widget', ChatInputWidgetElement);
window.customElements.define('chat-list-widget', ChatListWidgetElement);
window.customElements.define('chat-user-widget', ChatUserWidgetElement);
window.customElements.define('chat-bot-widget', ChatBotWidgetElement);

window.customElements.define('dialogflowcx-chat-widget', ChatWidgetElement);