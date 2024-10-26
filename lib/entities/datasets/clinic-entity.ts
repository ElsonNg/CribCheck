import LocationEntity from "@/lib/entities/location/location-entity";

/**
 * @class ClinicEntity
 * 
 * Represents a clinic location by extending `LocationEntity` and adding a name property.
 * This class provides functionality to store and retrieve the clinic's name along with its location coordinates.
 * 
 * @extends LocationEntity
 */
class ClinicEntity extends LocationEntity {
    private name: string;

    /**
     * Constructs an instance of `ClinicEntity` with a specified name and location.
     * 
     * @param {string} name - The name of the clinic.
     * @param {LocationEntity} location - The location entity containing latitude and longitude of the clinic.
     */
    constructor(name: string, location: LocationEntity) {
        super(location.latitude, location.longitude);
        this.name = name;
    }

    /**
     * Retrieves the name of the clinic.
     * 
     * @returns {string} The name of the clinic.
     */
    public getName(): string {
        return this.name;
    }
}

export default ClinicEntity;
