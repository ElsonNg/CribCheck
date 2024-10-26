import LocationEntity from "../location/location-entity";

/**
 * @class MRTStationEntity
 * 
 * Represents an MRT station location by extending `LocationEntity` and adding a name property.
 * This class provides functionality to store and retrieve the MRT station's name along with its geographic coordinates.
 * 
 * @extends LocationEntity
 */
class MRTStationEntity extends LocationEntity {
    private name: string;

    /**
     * Constructs an instance of `MRTStationEntity` with a specified name and location.
     * 
     * @param {string} name - The name of the MRT station.
     * @param {LocationEntity} location - The location entity containing the latitude and longitude of the MRT station.
     */
    constructor(name: string, location: LocationEntity) {
        super(location.latitude, location.longitude);
        this.name = name;
    }

    /**
     * Retrieves the name of the MRT station.
     * 
     * @returns {string} The name of the MRT station.
     */
    public getName(): string {
        return this.name;
    }
}

export default MRTStationEntity;
