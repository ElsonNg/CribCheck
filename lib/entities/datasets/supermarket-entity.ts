import LocationEntity from "@/lib/entities/location/location-entity";

class SupermarketEntity extends LocationEntity {

    private name : string;

    constructor(name : string, location: LocationEntity) {
        super(location.latitude, location.longitude);
        this.name = name;
    }

    public getName() : string {
        return this.name;
    }
}

export default SupermarketEntity;