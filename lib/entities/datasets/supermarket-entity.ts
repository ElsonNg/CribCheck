import LocationEntity from "@/lib/entities/location/location-entity";

/**
 * @class SupermarketEntity
 * 
 * Represents a supermarket location by extending `LocationEntity` and adding a name property.
 * This class provides functionality to store and retrieve the supermarket's name along with its location coordinates.
 * 
 * @extends LocationEntity
 */
class SupermarketEntity extends LocationEntity {
    private name: string;

    /**
     * Constructs an instance of `SupermarketEntity` with a specified name and location.
     * 
     * @param {string} name - The name of the supermarket.
     * @param {LocationEntity} location - The location entity containing latitude and longitude of the supermarket.
     */
    constructor(name: string, location: LocationEntity) {
        super(location.latitude, location.longitude);
        this.name = name;
    }

    /**
     * Retrieves the name of the supermarket.
     * 
     * @returns {string} The name of the supermarket.
     */
    public getName(): string {
        return this.name;
    }
}

export default SupermarketEntity;
