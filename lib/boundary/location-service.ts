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
     * Geographic bounds for Singapore, used to restrict location services to this region.
     * This rectangular boundary provides rough limits to identify if a location is within Singapore.
     */
    public static readonly SINGAPORE_BOUNDS_RECT = {
        north: 1.472,
        south: 1.23,
        east: 104.035,
        west: 103.605,
        // north: 1.56,
        // south: 1.145,
        // east: 104.2,
        // west: 103.45,
    }

    /**
    * Geographic boundary defined as a polygon for more precise region checking within Singapore.
    * The array contains coordinates (latitude and longitude) defining the boundary of Singapore.
    */
    public static readonly SINGAPORE_BOUNDS_POLYGON = [
        { lat: 1.4722264460140384, lng: 103.828983883667 },
        { lat: 1.3901931463330104, lng: 103.97009903948744 },
        { lat: 1.3929389183293432, lng: 103.9958482460304 },
        { lat: 1.3730319992568523, lng: 104.00958115618666 },
        { lat: 1.3535956881386368, lng: 104.029541015625 },
        { lat: 1.306445596217566, lng: 104.01576096575697 },
        { lat: 1.3126237917424461, lng: 103.9738755897804 },
        { lat: 1.2614816090009457, lng: 103.86126572649916 },
        { lat: 1.2350520307688402, lng: 103.83345658343275 },
        { lat: 1.2553032898739094, lng: 103.77749497454603 },
        { lat: 1.29614856994912, lng: 103.71260697405775 },
        { lat: 1.2810461891097236, lng: 103.6552720741554 },
        { lat: 1.268689629435516, lng: 103.64737565081556 },
        { lat: 1.2051897238125668, lng: 103.65012223284681 },
        { lat: 1.2168600900938313, lng: 103.5999971107765 },
        { lat: 1.2618248485229415, lng: 103.60308701556166 },
        { lat: 1.3586213072889568, lng: 103.64075718383789 },
        { lat: 1.43344344695961, lng: 103.68058262329102 },
        { lat: 1.4548943030987818, lng: 103.72324047546387 },
        { lat: 1.4404305182774615, lng: 103.75439701538086 },
        { lat: 1.4744084750859894, lng: 103.81276188354492 }
    ];


    /**
     * Checks if a given location is within Singapore's rectangular bounds.
     * This method verifies whether the provided latitude and longitude fall 
     * within a predefined rectangular area that roughly encompasses Singapore.
     *
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @returns {boolean} - True if the location is within the rectangular bounds of Singapore, otherwise false.
     */
    public static isWithinSingaporeBoundsRect(latitude: number, longitude: number): boolean {

        return (
            latitude >= LocationService.SINGAPORE_BOUNDS_RECT.south &&
            latitude <= LocationService.SINGAPORE_BOUNDS_RECT.north &&
            longitude >= LocationService.SINGAPORE_BOUNDS_RECT.west &&
            longitude <= LocationService.SINGAPORE_BOUNDS_RECT.east
        );
    }

    /**
     * Determines if a location is within the Singapore polygon bounds using a point-in-polygon algorithm.
     * This method uses a more precise polygon boundary to check if the given latitude and longitude fall 
     * within the complex geographic shape representing Singapore.
     *
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @returns {boolean} - True if the location is within the polygonal bounds of Singapore, otherwise false.
     */
    public static isWithinSingaporeBounds(latitude: number, longitude: number): boolean {

        let isInside = false;

        for (let i = 0, j = LocationService.SINGAPORE_BOUNDS_POLYGON.length - 1; i < LocationService.SINGAPORE_BOUNDS_POLYGON.length; j = i++) {
            const xi = LocationService.SINGAPORE_BOUNDS_POLYGON[i].lng;
            const yi = LocationService.SINGAPORE_BOUNDS_POLYGON[i].lat;
            const xj = LocationService.SINGAPORE_BOUNDS_POLYGON[j].lng;
            const yj = LocationService.SINGAPORE_BOUNDS_POLYGON[j].lat;

            const intersect = ((yi > latitude) !== (yj > latitude)) &&
                (longitude < (xj - xi) * (latitude - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }

        return isInside;
    }

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
