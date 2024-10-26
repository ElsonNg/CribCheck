/**
 * The `LocationEntity` class represents a geographic location with details such as
 * latitude, longitude, and possibly an address or name. This entity is used
 * throughout the application to handle location-related operations.
 * 
 * @class LocationEntity
 */
class LocationEntity {

    /**
     * The latitude of the location (immutable).
     */
    public readonly latitude: number;

    /**
     * The longitude of the location (immutable).
     */
    public readonly longitude: number;

    /**
     * Optional: The address or name of the location (immutable).
     */
    public readonly address?: string;

    /**
     * Creates a new instance of `LocationEntity`.
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

    /**
     * Get the latitude of the location.
     */
    public getLatitude(): number {
        return this.latitude;
    }

    /**
     * Get the longitude of the location.
     */
    public getLongitude(): number {
        return this.longitude;
    }

    public equals(other: LocationEntity) : boolean {
        return (this.address && other.address && this.address === other.address) || (this.latitude === other.latitude && this.longitude === other.longitude);
    }

    /**
     * Get the address of the location. If no address is set, returns 'None'.
     * 
     * @returns {string} The address or a default message if none exists.
     */
    public getAddress(): string {
        return this.address ?? 'None';
    }

    /**
     * Converts degrees to radians.
     * 
     * @param degrees - The value in degrees to be converted.
     * @returns {number} The equivalent value in radians.
     */
    private static toRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }

    /**
     * Calculates the distance to another `LocationEntity` in kilometers using the Haversine formula.
     * 
     * @param other - Another `LocationEntity` object.
     * @returns {number} The distance to the other location in kilometers.
     */
    public distanceToKilometres(other: LocationEntity): number {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = LocationEntity.toRadians(this.latitude);
        const lat2 = LocationEntity.toRadians(other.latitude);
        const deltaLat = LocationEntity.toRadians(other.latitude - this.latitude);
        const deltaLon = LocationEntity.toRadians(other.longitude - this.longitude);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
    }

    /**
     * Calculates the distance to another `LocationEntity` in meters.
     * 
     * @param other - Another `LocationEntity` object.
     * @returns {number} The distance to the other location in meters.
     */
    public distanceToMetres(other: LocationEntity): number {
        return this.distanceToKilometres(other) * 1000;
    }

    public toJSON() : Record<string, unknown> {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            ...(this.address ? {address: this.address} : {}),
        };
    }
}

export default LocationEntity;
