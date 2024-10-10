import LocationEntity from "@/lib/entities/location-entity";

class HawkerCentreEntity {

    private location : LocationEntity;
    private name : string;

    constructor(name : string, location: LocationEntity) {
        this.name = name;
        this.location = location;
    }

    public getLocation() : LocationEntity {
        return this.location;
    }

    public getName() : string {
        return this.name;
    }
}

export default HawkerCentreEntity;