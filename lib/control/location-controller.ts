import LocationEntity from '@/lib/entities/location/location-entity';
import LocationPredictionEntity from '@/lib/entities/location/location-prediction-entity';
import LocationService from '@/lib/boundary/location-service';
import { GoogleLocation, GooglePrediction } from '../boundary/implementation/google-location-service';

/**
 * The `LocationController` class manages location-related operations by interacting
 * with the `GoogleLocationService`. It provides methods to fetch the current location,
 * retrieve location details by coordinates, calculate the distance between two locations,
 * and search for locations by a query string.
 * 
 * @class LocationController
 */
class LocationController {

    private locationService: LocationService<GoogleLocation, GooglePrediction>;

    /**
     * Creates an instance of `LocationController` and sets the `LocationService` used to
     * handle location-related logic.
     * 
     * @param locationService - The `GoogleLocationService` instance responsible for performing location-based actions.
     */
    constructor(locationService: LocationService<GoogleLocation, GooglePrediction>) {
        this.locationService = locationService;
    }

    /**
     * Maps a `GoogleLocation` object to a `LocationEntity`.
     * 
     * Converts the Google location data into an internal `LocationEntity`
     * used within the application.
     *
     * @param location - The `GoogleLocation` object containing external location data.
     * @returns {LocationEntity | null} A `LocationEntity` object with the location's latitude, longitude, and address, or `null` if the location is invalid.
     */
    private mapToLocationEntity(location: GoogleLocation): LocationEntity | null {
        if (location === null) return null;
        return new LocationEntity(location.latitude, location.longitude, location.address);
    }

    /**
     * Maps a `GooglePrediction` object to a `LocationPredictionEntity`.
     * 
     * Converts the Google prediction data into an internal `LocationPredictionEntity`
     * used within the application for location predictions.
     *
     * @param prediction - The `GooglePrediction` object containing external prediction data.
     * @returns {LocationPredictionEntity | null} A `LocationPredictionEntity` object with the prediction's placeId and description, or `null` if the prediction is invalid.
     */ 
    private mapToPredictionEntity(prediction: GooglePrediction): LocationPredictionEntity | null {
        if (prediction === null) return null;
        return new LocationPredictionEntity(prediction.placeId, prediction.description);
    }

    /**
     * Fetches the current location of the user/device.
     *
     * @returns {Promise<LocationEntity | null>} A promise that resolves to the current location entity or `null` if the location cannot be fetched.
     */
    async getCurrentLocation(): Promise<LocationEntity | null> {
        const result = await this.locationService.getCurrentLocation();
        return this.mapToLocationEntity(result!);
    }

    /**
     * Retrieves location details using geographic coordinates.
     * 
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @returns {Promise<LocationEntity | null>} A promise that resolves to the location entity with details, or `null` if not found.
     */
    async getLocationByCoordinates(latitude: number, longitude: number): Promise<LocationEntity | null> {
        const result = await this.locationService.getLocationByCoordinates(latitude, longitude);
        return this.mapToLocationEntity(result!);
    }

    /**
     * Retrieves a location entity based on a prediction object.
     *
     * This method handles a location prediction, often from an autocomplete
     * suggestion, and retrieves the full location details via the service.
     * 
     * @param prediction - The location prediction entity containing the placeId.
     * @returns {Promise<LocationEntity | null>} A promise that resolves to the location entity with full details, or `null` if not found.
     */
    async getLocationByPrediction(prediction: LocationPredictionEntity): Promise<LocationEntity | null> {
        const result = await this.locationService.getLocationByPrediction(prediction);
        return this.mapToLocationEntity(result!);
    }

    /**
      * Searches for locations by a query string.
      *
      * This method performs a location search using the autocomplete feature by passing
      * the search query to the service, which returns matching predictions.
      *
      * @param query - The search string or keyword to find locations.
      * @returns {Promise<LocationEntity[] | null>} A promise that resolves to an array of matching locations or `null` if no matches are found.
      */
    async queryLocationAutoComplete(query: string): Promise<LocationPredictionEntity[] | null> {
        const result = await this.locationService.queryLocationAutoComplete(query);
        if (result === null) return null;
        return result.map(prediction => this.mapToPredictionEntity(prediction)!);
    }
}

export default LocationController;
