import LocationEntity from "@/lib/entities/location/location-entity";

/**
 * @class HawkerCentreEntity
 * 
 * Represents a hawker center location by extending `LocationEntity` and adding a name property.
 * This class provides functionality to store and retrieve the hawker center's name along with its location coordinates.
 * 
 * @extends LocationEntity
 */
class HawkerCentreEntity extends LocationEntity {
    private name: string;

    /**
     * Constructs an instance of `HawkerCentreEntity` with a specified name and location.
     * 
     * @param {string} name - The name of the hawker center.
     * @param {LocationEntity} location - The location entity containing latitude and longitude of the hawker center.
     */
    constructor(name: string, location: LocationEntity) {
        super(location.latitude, location.longitude);
        this.name = name;
    }

    /**
     * Retrieves the name of the hawker center.
     * 
     * @returns {string} The name of the hawker center.
     */
    public getName(): string {
        return this.name;
    }
}

export default HawkerCentreEntity;
