/**
 * The `Location` entity represents a geographic location with details such as
 * latitude, longitude, and possibly an address or name. This entity is used
 * throughout the application to handle location-related operations.
 * 
 * @class Location
 */
class LocationEntity {

    /**
     * The latitude of the location.
     */
    private latitude: number;

    /**
     * The longitude of the location.
     */
    private longitude: number;

    /**
     * Optional: The address or name of the location.
     */
    private address?: string;

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

    public getLatitude(): number {
        return this.latitude;
    }

    public getLongitude(): number {
        return this.longitude;
    }

    public getAddress(): string {
        return this.address ?? 'None';
    }

    private static toRadians(degrees: number) : number {
        return (degrees * Math.PI) / 180;
    }

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

        const distance = R * c; // Distance in kilometers
        return distance;
    }

    public distanceToMetres(other: LocationEntity): number {
        return this.distanceToKilometres(other) * 1000;
    }
}

export default LocationEntity;
