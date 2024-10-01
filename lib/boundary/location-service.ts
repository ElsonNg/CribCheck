/**
 * `LocationService` is an abstract class that defines the contract for any
 * location-related services, such as fetching location data or checking the distance
 * between two locations. This class provides a blueprint for services that deal with 
 * geographic information.
 *
 * Derived classes must implement methods for:
 * - Fetching the current location.
 * - Retrieving location details by coordinates.
 * - Calculating the distance between two locations.
 *
 * @template T - The type of the location entity used in the service.
 * 
 * @abstract
 * @class LocationService
 */
abstract class LocationService<T> {

    /**
     * Abstract method to fetch the current location of the user or device.
     *
     * @returns {Promise<T | null>} A promise that resolves to the current location entity, or `null` if location could not be fetched.
     */
    abstract getCurrentLocation(): Promise<T | null>;

    /**
     * Abstract method to retrieve location details using geographic coordinates.
     *
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @returns {Promise<T | null>} A promise that resolves to the location entity containing details about the coordinates, or `null` if not found.
     */
    abstract getLocationByCoordinates(latitude: number, longitude: number): Promise<T | null>;

    /**
     * Abstract method to calculate the distance between two locations.
     *
     * @param from - The origin location entity.
     * @param to - The destination location entity.
     * @returns {Promise<number>} A promise that resolves to the distance in kilometers between the two locations.
     */
    abstract calculateDistance(from: T, to: T): Promise<number>;
}

export default LocationService;

