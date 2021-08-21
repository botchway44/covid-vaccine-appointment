import { Loader } from '@googlemaps/js-api-loader';


export class MapsApi {

    userPosition: google.maps.LatLngLiteral = { lat: -25.363, lng: 131.044 };

    apiKey: string;

    mapsRef: google.maps.Map;
    autocompleteRef: google.maps.places.Autocomplete;
    markerRef: google.maps.Marker;
    infowindow: google.maps.InfoWindow;

    mapContainer: HTMLElement;

    // Google Ref
    googleRef: any;

    infowindowContent: HTMLElement;

    // TODO: change this approach to promise, the initialization of this
    isInitialized: boolean = false;
    hasError: boolean = false;

    constructor(apiKey: string, element: HTMLElement) {


        this.mapContainer = element;
        this.apiKey = apiKey;

        console.log(this.mapContainer);
        // Initiatizalize the Google Maps API
        const loader = new Loader({
            apiKey: this.apiKey,
            version: "weekly",
            libraries: ["places"]
        });

        const mapOptions = {
            center: {
                lat: 0,
                lng: 0
            },
            zoom: 4
        };

        const mapElement = this.mapContainer.querySelector("#map") as HTMLElement;

        const input = this.mapContainer.querySelector("#pac-input") as HTMLInputElement;

        const options = {
            componentRestrictions: { country: "gh" },
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
            types: ["establishment"],
        };


        // Promise
        loader
            .load()
            .then((google) => {

                this.googleRef = google;

                this.mapsRef = new google.maps.Map(mapElement, mapOptions);
                this.autocompleteRef = new google.maps.places.Autocomplete(input, options);
                this.infowindow = new google.maps.InfoWindow();

                console.log("Autocomplete reference :::: ", this.autocompleteRef);
                console.log("Info Window :::: ", this.infowindow);

                this.isInitialized = true;
                this.hasError = false;
            })
            .catch(e => {
                // do something
                console.log(e);
                this.isInitialized = true;
                this.hasError = true;

            });


        //Register or Bind events Listeners
        this.success = this.success.bind(this);
        this.error = this.error.bind(this);
    }




    centerMarker() {


        // this.markerRef = new this.googleRef.maps.Marker({
        //     position: this.userPosition,
        //     map: this.mapsRef,
        //     title: "Click to zoom",
        // });

        this.markerRef.setPosition(this.userPosition);

        window.setTimeout(() => {
            this.mapsRef.panTo(this.markerRef.getPosition() as google.maps.LatLng);
            this.mapsRef.setZoom(15);
        }, 3000);


    }


    // This example requires the Places library. Include the libraries=places
    // parameter when you first load the API. For example:
    // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

    initMap(): void {


        // const card = this.mapContainer.querySelector("#pac-card") as HTMLElement;


        // this.mapsRef.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);


        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocompleteRef.bindTo("bounds", this.mapsRef);

        this.infowindowContent = this.mapContainer.querySelector(
            "#infowindow-content"
        ) as HTMLElement;

        this.infowindow.setContent(this.infowindowContent);

        this.markerRef = new this.googleRef.maps.Marker({
            map: this.mapsRef,
            anchorPoint: new this.googleRef.maps.Point(0, -29),
        });

        // Listen to new location selected
        this.autocompleteRef.addListener("place_changed", () => {
            this.infowindow.close();
            this.markerRef.setVisible(false);
            const place = this.autocompleteRef.getPlace();

            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                this.mapsRef.fitBounds(place.geometry.viewport);
            } else {
                this.mapsRef.setCenter(place.geometry.location);
                this.mapsRef.setZoom(17);
            }
            this.markerRef.setPosition(place.geometry.location);
            this.markerRef.setVisible(true);

            console.log("PLACE::: ", JSON.stringify(place))

            this.infowindowContent.querySelector("#place-name").textContent = place?.name;
            this.infowindowContent.querySelector("#place-address").textContent = place?.formatted_address;

            // set userPosition to the new position
            this.userPosition = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };

            console.log("USER POSITION::: ", this.userPosition)
            this.infowindow.open(this.mapsRef, this.markerRef);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        // this.autocompleteRef.setTypes([]);


        // Configure the click listener.
        this.mapsRef.addListener("click", (mapsMouseEvent: any) => {

            this.userPosition = { lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() };
            console.log("USER POSITION::: ", this.userPosition)

            this.centerMarker();
        });

        // this.mapsRef.addListener("center_changed", () => {
        //     // 3 seconds after the center of the map has changed, pan back to the
        //     // marker.
        //     this.centerMarker()
        // });

        // Find Users Location
        this.geoFindMe();

    }

    setUserPosition(userLocation: any) {

        this.userPosition = userLocation;

        this.centerMarker()
    }

    /*
    * Handles User Location Finding
    * TODO: Repetitive - Remove one in chat-widget
    */
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

    }

    protected success(position: any) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("POSITION :::: ", latitude, longitude);


        this.userPosition = { lat: latitude, lng: longitude };

        this.userLocationRetrieved = true;
        this.userLocationError = false;

        this.centerMarker();
        // TODO : pick the name of the users location

    }
}