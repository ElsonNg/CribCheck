/**
 * The `LocationEntity` class represents a geographic location with properties such as
 * latitude, longitude, and an optional address. This class includes methods to
 * retrieve and compare coordinates, calculate distances between locations, and
 * convert its data into JSON format.
 * 
 * @class LocationEntity
 */
class LocationEntity {
    /**
     * The latitude of the location, representing north-south position (immutable).
     */
    public readonly latitude: number;

    /**
     * The longitude of the location, representing east-west position (immutable).
     */
    public readonly longitude: number;

    /**
     * Optional address or name for the location (immutable).
     */
    public readonly address?: string;

    /**
     * Constructs a new `LocationEntity` instance.
     * 
     * @param {number} latitude - The latitude of the location.
     * @param {number} longitude - The longitude of the location.
     * @param {string} [address] - Optional address or name of the location.
     */
    constructor(latitude: number, longitude: number, address?: string) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    /**
     * Retrieves the latitude of the location.
     * 
     * @returns {number} The latitude value.
     */
    public getLatitude(): number {
        return this.latitude;
    }

    /**
     * Retrieves the longitude of the location.
     * 
     * @returns {number} The longitude value.
     */
    public getLongitude(): number {
        return this.longitude;
    }

    /**
     * Compares this `LocationEntity` with another based on coordinates or address.
     * 
     * Two locations are considered equal if both addresses are defined and identical,
     * or if their latitude and longitude values are exactly the same.
     * 
     * @param {LocationEntity} other - Another location entity to compare.
     * @returns {boolean} `true` if the locations are equal, otherwise `false`.
     */
    public equals(other: LocationEntity): boolean {
        return (this.address && other.address && this.address === other.address) ||
               (this.latitude === other.latitude && this.longitude === other.longitude);
    }

    /**
     * Retrieves the address of the location, or returns 'None' if no address is set.
     * 
     * @returns {string} The address of the location, or 'None' if no address is available.
     */
    public getAddress(): string {
        return this.address ?? 'None';
    }

    /**
     * Converts a degree value to radians.
     * 
     * @param {number} degrees - The value in degrees to convert.
     * @returns {number} The equivalent value in radians.
     */
    private static toRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }

    /**
     * Calculates the distance to another `LocationEntity` in kilometers using the Haversine formula.
     * 
     * The Haversine formula accounts for the Earth's curvature, making it accurate for
     * calculating distances between two points on a sphere.
     * 
     * @param {LocationEntity} other - The location to measure the distance to.
     * @returns {number} The distance in kilometers.
     */
    public distanceToKilometres(other: LocationEntity): number {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = LocationEntity.toRadians(this.latitude);
        const lat2 = LocationEntity.toRadians(other.latitude);
        const deltaLat = LocationEntity.toRadians(other.latitude - this.latitude);
        const deltaLon = LocationEntity.toRadians(other.longitude - this.longitude);

        const a = Math.sin(deltaLat / 2) ** 2 +
                  Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
    }

    /**
     * Calculates the distance to another `LocationEntity` in meters.
     * 
     * This method uses the `distanceToKilometres` method and converts the result to meters.
     * 
     * @param {LocationEntity} other - The location to measure the distance to.
     * @returns {number} The distance in meters.
     */
    public distanceToMetres(other: LocationEntity): number {
        return this.distanceToKilometres(other) * 1000;
    }

    /**
     * Converts the `LocationEntity` to a JSON object.
     * 
     * This method creates a JSON representation of the location, including latitude, longitude,
     * and address if available.
     * 
     * @returns {Record<string, unknown>} A JSON object representing the location.
     */
    public toJSON(): Record<string, unknown> {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            ...(this.address ? { address: this.address } : {}),
        };
    }
}

export default LocationEntity;
