
import { chatLocationPickerTemplate } from './assets';
import { MapsApi } from './helper/maps-api';
import { IChat, IMedia, LOCATION_REQUEST } from '../models/chat.model';

export class ChatLocationPickerWidgetElement extends HTMLElement {
  private domInitialized = false;
  private chat: IChat;
  private currentLocationElement: HTMLElement
  private selectedLocationElement: HTMLElement
  private mapsApi: MapsApi


  /**
   * Returns attributes to be used 
   */
  static get observedAttributes() {
    return [''];
  }

  /**
   * <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={ENTER YOUR KEY}"></script>
   * <script src="https://unpkg.com/location-picker/dist/location-picker.min.js"></script>
*/

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(chatLocationPickerTemplate.content.cloneNode(true));

    console.log(chatLocationPickerTemplate.content.cloneNode(true));

    // this.message = JSON.parse(this.getAttribute("data"));
    // this.chat = JSON.parse(this.getAttribute("message"));

    // get the message element and append message
    this.currentLocationElement = this.shadowRoot.querySelector("#current-location");
    this.selectedLocationElement = this.shadowRoot.querySelector("#selected-location");

    const parentElement = this.shadowRoot.querySelector(".chat-widget-location-picker-container") as HTMLElement;
    this.mapsApi = new MapsApi("AIzaSyCz9cwFYF5or5P1UVbhVE7MntkDdkyfTas", parentElement);

    //Register or Bind events Listeners
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
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


    // Add Eventlistener to current Location Element
    this.currentLocationElement.addEventListener("click", async (_event) => {
      console.log("Current location clicked");

      // get Location
      this.geoFindMe();
      this.checkUserLocationRetrieved();

    });

    // Add Eventlistener to Selected Location Element
    this.selectedLocationElement.addEventListener("click", (_event) => {
      console.log("User selected location clicked");
      const query = this.chat.messageType === "LOCATION_PICKER_ATM" ? 'atm_locator' : 'branch_locate';

      // get location and emit 
      const payload: LOCATION_REQUEST = {
        longitude: this.mapsApi.userPosition.lng,
        latitude: this.mapsApi.userPosition.lat,
        query: "Use selected location",
        intentQuery: query
      }

      console.log("PAYLOAD:: ", payload);
      this.emitLocationSelectedEvent(payload);
    });

    // Initializes the maps Api state
    // TODO : Change to promise implementation
    this.initMapState();
  }

  // TODO : Move to a Maps API
  checkUserLocationRetrieved() {

    setTimeout(() => {
      if (!this.userLocationRetrieved && !this.userLocationError) {

        //  Recursively call this function to check if location is retrieved
        this.checkUserLocationRetrieved()
      }
      else if (this.userLocationError) {
        console.log("User location retrieving error");
      }
      else {

        this.mapsApi.setUserPosition(this.userPosition);

        // IF Location is ATM use ATM querying type
        const query = this.chat.messageType === "LOCATION_PICKER_ATM" ? 'atm_locator' : 'branch_locate';
        // Send Payload to Display location
        const payload: LOCATION_REQUEST = {
          longitude: this.userPosition.lng,
          latitude: this.userPosition.lat,
          query: "Use my location",
          intentQuery: query
        }

        console.log(payload);
        this.emitLocationSelectedEvent(payload);
      }
    }, 5000);

  }


  // Initializes the map state by verifying if its done loading 
  // TODO : Use promises instead
  initMapState() {

    setTimeout(() => {
      if (!this.mapsApi.isInitialized) {
        this.initMapState();
      } else {
        // clear setTimeout
        // clearTimeout(this.mapsInitialize);
        this.mapsApi.initMap();

        // TODO : Display if it has an error
      }
    }, 5000);

  }

  loaderToggledEvent(state: boolean) {
    const event = new CustomEvent("chatLoaderToggled", {
      detail: { state: state }
    });

    // Dispatch an event to the GLobal scope to be handled by the send chat frame
    window.dispatchEvent(event);
  }

  emitLocationSelectedEvent(payload: LOCATION_REQUEST) {
    const event = new CustomEvent("locationSelected", {
      detail: payload
    });

    // Dispatch an event to the GLobal scope to be handled by the send chat frame
    window.dispatchEvent(event);
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


  // Gets the Users Location
  protected userPosition = { lat: 0, lng: 0 };
  protected userLocationRetrieved: boolean = false;
  protected userLocationError: boolean = false;

  geoFindMe() {
    if (!navigator.geolocation) {
      // status.textContent = 'Geolocation is not supported by your browser';
    } else {
      // status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    }
  }

  protected error() {
    // status.textContent = 'Unable to retrieve your location';
    this.userLocationError = true;
    this.userLocationRetrieved = false;

    this.emitLocationErrorEvent();

    this.loaderToggledEvent(false);

  }

  emitLocationErrorEvent() {
    const event = new CustomEvent("locationPickerError", {
      detail: "I had trouble picking your location, please try again"
    });

    // Dispatch an event to the GLobal scope to be handled by the send chat frame
    window.dispatchEvent(event);
  }
  protected success(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("POSITION :::: ", latitude, longitude);


    this.userPosition = { lat: latitude, lng: longitude };

    this.userLocationRetrieved = true;
    this.userLocationError = false;
    this.loaderToggledEvent(true);
    this.mapsApi.centerMarker();

    // TODO : pick the name of the users location

  }

}
