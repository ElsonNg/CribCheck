import LocationEntity from "@/lib/entities/location/location-entity";

/**
 * @class SchoolEntity
 * 
 * Represents a school location by extending `LocationEntity` and adding a name property.
 * This class provides functionality to store and retrieve the school's name along with its location coordinates.
 * 
 * @extends LocationEntity
 */
class SchoolEntity extends LocationEntity {
    private name: string;

    /**
     * Constructs an instance of `SchoolEntity` with a specified name and location.
     * 
     * @param {string} name - The name of the school.
     * @param {LocationEntity} location - The location entity containing latitude and longitude of the school.
     */
    constructor(name: string, location: LocationEntity) {
        super(location.latitude, location.longitude);
        this.name = name;
    }

    /**
     * Retrieves the name of the school.
     * 
     * @returns {string} The name of the school.
     */
    public getName(): string {
        return this.name;
    }
}

export default SchoolEntity;
