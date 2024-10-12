/**
 * `LocationService` is an abstract class that defines the contract for services 
 * that manage location-based data, such as fetching current location, obtaining 
 * location details by coordinates, or suggesting location predictions. This serves 
 * as a blueprint for handling geographic information in various implementations.
 *
 * @template T - The type representing the full location entity (e.g., `LocationEntity`).
 * @template U - The type representing location predictions (e.g., `LocationPredictionEntity`).
 * 
 * @abstract
 * @class LocationService
 */
abstract class LocationService<T, U> {

    /**
     * Fetches the current geographic location, such as the user's device location.
     *
     * @returns {Promise<T | null>} A promise that resolves to the current location entity 
     *                              or `null` if the location cannot be determined.
     */
    abstract getCurrentLocation(): Promise<T | null>;

    /**
     * Retrieves location details using latitude and longitude coordinates.
     *
     * @param latitude - The latitude of the desired location.
     * @param longitude - The longitude of the desired location.
     * @returns {Promise<T | null>} A promise that resolves to a location entity corresponding 
     *                              to the given coordinates, or `null` if the location is not found.
     */
    abstract getLocationByCoordinates(latitude: number, longitude: number): Promise<T | null>;

    /**
     * Fetches location details based on a location prediction.
     *
     * @param prediction - The location prediction object.
     * @returns {Promise<T | null>} A promise that resolves to the location entity 
     *                              corresponding to the given prediction, or `null` if not found.
     */
    abstract getLocationByPrediction(prediction: U): Promise<T | null>;

    /**
     * Provides a list of location predictions based on a search query. This is commonly 
     * used for location autocomplete features.
     *
     * @param query - The search string used to get location suggestions.
     * @returns {Promise<U[] | null>} A promise that resolves to an array of location predictions 
     *                                matching the query, or `null` if no suggestions are found.
     */
    abstract queryLocationAutoComplete(query: string): Promise<U[] | null>;
}

export default LocationService;
