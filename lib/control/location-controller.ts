import GoogleLocationService from '@/lib/boundary/implementation/google-location-service';
import Location from '@/lib/entities/location-entity';

/**
 * The `LocationController` class manages location-related operations by interacting
 * with the `GoogleLocationService`. It provides methods to fetch the current location,
 * retrieve location details by coordinates, and calculate the distance between two locations.
 * 
 * @class LocationController
 */
class LocationController {

    private locationService: GoogleLocationService;

    /**
     * Creates an instance of `LocationController` and sets the `LocationService` used to
     * handle location-related logic.
     * 
     * @param locationService - The `GoogleLocationService` instance responsible for performing location-based actions.
     */
    constructor(locationService: GoogleLocationService) {
        this.locationService = locationService;
    }

    /**
     * Fetches the current location of the user/device.
     *
     * @returns {Promise<Location | null>} A promise that resolves to the current location entity or `null` if the location cannot be fetched.
     */
    async getCurrentLocation(): Promise<Location | null> {
        return this.locationService.getCurrentLocation();
    }

    /**
     * Retrieves location details using geographic coordinates.
     * 
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @returns {Promise<Location | null>} A promise that resolves to the location entity with details, or `null` if not found.
     */
    async getLocationByCoordinates(latitude: number, longitude: number): Promise<Location | null> {
        return this.locationService.getLocationByCoordinates(latitude, longitude);
    }

    /**
     * Calculates the distance between two locations.
     *
     * @param from - The origin location entity.
     * @param to - The destination location entity.
     * @returns {Promise<number>} A promise that resolves to the distance between the two locations in kilometers.
     */
    async calculateDistance(from: Location, to: Location): Promise<number> {
        return this.locationService.calculateDistance(from, to);
    }
}

export default LocationController;
