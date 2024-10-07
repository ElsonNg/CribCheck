/**
 * The `Location` entity represents a geographic location with details such as
 * latitude, longitude, and possibly an address or name. This entity is used
 * throughout the application to handle location-related operations.
 * 
 * @class Location
 */
class Location {

    /**
     * The latitude of the location.
     */
    public latitude: number;

    /**
     * The longitude of the location.
     */
    public longitude: number;

    /**
     * Optional: The address or name of the location.
     */
    public address?: string;

    /**
     * Creates a new instance of `Location`.
     * 
     * @param latitude - The latitude of the location.
     * @param longitude - The longitude of the location.
     * @param address - (Optional) The address or name of the location.
     */
    constructor(latitude: number, longitude: number, address?: string) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }
}

export default Location;
