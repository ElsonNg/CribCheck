import LocationService from "@/lib/boundary/location-service";
import LocationEntity from "@/lib/entities/location/location-entity";
import LocationPredictionEntity from "@/lib/entities/location/location-prediction-entity";

/**
 * GoogleLocationService is an implementation of LocationService for interacting with
 * the Google Maps JavaScript API. It provides services for geocoding, reverse geocoding,
 * location autocomplete, and retrieving detailed location information.
 *
 *
 * Note: The Google Maps JavaScript API script is injected in the layout file, so this service assumes
 *       that the script is already loaded and accessible when this service is initialized.
 */

export interface GoogleLocation {
    latitude: number;
    longitude: number;
    address: string;
}
export default class GoogleLocationService extends LocationService<LocationEntity, LocationPredictionEntity> {
    public autocompleteService: google.maps.places.AutocompleteService | null = null;
    public geocoder: google.maps.Geocoder | null = null;

    public static fetchCalls: number = 0;

    constructor() {
        super();
        GoogleLocationService.fetchCalls = 0;
    }

    /**
     *  Initializes the Google Maps services (Autocomplete and Geocoder) if they are not already initialized.
     *  Assumes that the Google Maps script is loaded in the layout file.
     *
     */
    private initializeServices() {

        if (!window.google || !window.google.maps) {
            throw new Error("Google Maps API is not loaded yet.");
        }

        try {

            this.autocompleteService = new google.maps.places.AutocompleteService();
            this.geocoder = new google.maps.Geocoder();

        } catch (error) {
            throw new Error("Failed to initialize Google Maps services: " + error);
        }
    }



    /**
     * Fetches the current geographic location using the browser's Geolocation API.
     *
     * @returns {Promise<LocationEntity | null>} A promise resolving to the current location
     *                                          as a LocationEntity, or null if location services are unavailable.
     */
    async getCurrentLocation(): Promise<LocationEntity | null> {
        try {

            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            if (LocationService.isWithinSingaporeBounds(latitude, longitude)) {
                                resolve(new LocationEntity(latitude, longitude, "Current Location"));
                            } else {
                                reject(new Error("Current location is outside of Singapore."));
                            }
                        },
                        (error) => {
                            reject(new Error("Geolocation error: " + error.message));
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60 * 1000 }
                    );
                } else {
                    reject(new Error("Geolocation is not supported by this browser."));
                }
            });
        } catch (error) {
            throw new Error("Error fetching current location: " + error);
        }
    }

    /**
     * Retrieves location details (e.g., address) based on latitude and longitude coordinates
     * using the Google Geocoding API.
     *
     * @param latitude - Latitude of the location.
     * @param longitude - Longitude of the location.
     * @returns {Promise<LocationEntity | null>} A promise resolving to the location entity 
     *                                          or null if the location details cannot be fetched.
     */
    async getLocationByCoordinates(latitude: number, longitude: number): Promise<LocationEntity | null> {
        try {

            if (!LocationService.isWithinSingaporeBounds(latitude, longitude)) {
                throw new Error("Out of Bounds");
            }

            if (!this.geocoder) {
                this.initializeServices();
            }

            return new Promise((resolve, reject) => {
                GoogleLocationService.fetchCalls++;
                this.geocoder?.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {

                        const location = new LocationEntity(
                            latitude,
                            longitude,
                            results[0].formatted_address || "Unknown address"
                        );
                        resolve(location);
                    } else {
                        reject(new Error("Error fetching geocode data: " + status));
                    }
                });
            });
        } catch (error) {
            throw new Error("Error getting location by coordinates: " + error);
        }
    }

    /**
     * Retrieves detailed location information based on a place prediction (typically returned from autocomplete).
     *
     * @param prediction - The location prediction entity containing the placeId.
     * @returns {Promise<LocationEntity | null>} A promise resolving to the location entity 
     *                                          or null if details cannot be fetched.
     */
    async getLocationByPrediction(prediction: LocationPredictionEntity): Promise<LocationEntity | null> {
        try {

            if (!this.autocompleteService) {
                this.initializeServices();
            }

            const placeDetailsRequest = {
                placeId: prediction.placeId,
                fields: ["geometry", "formatted_address"],
            };

            return new Promise((resolve, reject) => {
                const placesService = new google.maps.places.PlacesService(document.createElement("div"));
                GoogleLocationService.fetchCalls++;
                console.log("Fetch Calls: ", GoogleLocationService.fetchCalls);

                placesService.getDetails(placeDetailsRequest, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {

                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        if (LocationService.isWithinSingaporeBounds(lat, lng)) {
                            const location = new LocationEntity(
                                place.geometry.location.lat(),
                                place.geometry.location.lng(),
                                place.formatted_address || "Unknown address"
                            );
                            resolve(location);
                        } else {
                            reject(new Error("Out of Bounds"));
                        }
                    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        resolve(null);
                    } else {
                        reject(new Error("Error fetching place details: " + status));
                    }
                });
            });
        } catch (error) {
            throw new Error("Error getting location by prediction: " + error);
        }
    }

    /**
     * Fetches location predictions based on a search query using the Google Places Autocomplete API.
     * This is useful for providing autocomplete suggestions as the user types in a search box.
     *
     * @param query - The search string used to generate location suggestions.
     * @returns {Promise<LocationPredictionEntity[] | null>} A promise resolving to an array of location predictions 
     *                                                      or null if no suggestions are found.
     */
    async queryLocationAutoComplete(query: string): Promise<LocationPredictionEntity[] | null> {
        try {

            if (!this.autocompleteService) {
                this.initializeServices();
            }


            return new Promise((resolve, reject) => {
                GoogleLocationService.fetchCalls++;
                console.log("Fetch Calls: ", GoogleLocationService.fetchCalls);
                this.autocompleteService?.getPlacePredictions({
                    input: query,
                    bounds: LocationService.SINGAPORE_BOUNDS_RECT, // Restrict predictions to Singapore's geographic bounds
                    componentRestrictions: { country: "SG" }, // Restrict predictions to Singapore
                }, (predictions, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        if (!predictions) {
                            resolve([]);
                            return;
                        }
                        const results = predictions.map(
                            (p) => new LocationPredictionEntity(p.place_id, p.description)
                        );
                        resolve(results);
                    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        resolve([]);
                    } else {
                        reject(new Error("Error fetching place predictions: " + status));
                    }
                });
            });
        } catch (error) {
            throw new Error("Error querying location autocomplete: " + error);
        }
    }
}
