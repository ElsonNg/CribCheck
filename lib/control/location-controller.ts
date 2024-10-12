import LocationEntity from '@/lib/entities/location/location-entity';
import LocationPredictionEntity from '@/lib/entities/location/location-prediction-entity';
import LocationService from '@/lib/boundary/location-service';

/**
 * The `LocationController` class manages location-related operations by interacting
 * with the `GoogleLocationService`. It provides methods to fetch the current location,
 * retrieve location details by coordinates, calculate the distance between two locations,
 * and search for locations by a query string.
 * 
 * @class LocationController
 */
class LocationController {

    private locationService: LocationService<LocationEntity, LocationPredictionEntity>;

    /**
     * Creates an instance of `LocationController` and sets the `LocationService` used to
     * handle location-related logic.
     * 
     * @param locationService - The `GoogleLocationService` instance responsible for performing location-based actions.
     */
    constructor(locationService: LocationService<LocationEntity, LocationPredictionEntity>) {
        this.locationService = locationService;
    }


    /**
     * Fetches the current location of the user/device.
     *
     * @returns {Promise<LocationEntity | null>} A promise that resolves to the current location entity or `null` if the location cannot be fetched.
     */
    async getCurrentLocation(): Promise<LocationEntity | null> {
        return this.locationService.getCurrentLocation();
    }

    /**
     * Retrieves location details using geographic coordinates.
     * 
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @returns {Promise<LocationEntity | null>} A promise that resolves to the location entity with details, or `null` if not found.
     */
    async getLocationByCoordinates(latitude: number, longitude: number): Promise<LocationEntity | null> {
        return this.locationService.getLocationByCoordinates(latitude, longitude);
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
        return this.locationService.getLocationByPrediction(prediction);
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
        return this.locationService.queryLocationAutoComplete(query);
    }
}

export default LocationController;
