/**
 * @class UserProfile
 * 
 * The `UserProfile` class represents the user's profile data within the application.
 * It includes attributes such as `userId`, `name`, `email`, and `presets`.
 * 
 * This class provides methods to retrieve these attributes, and also includes
 * a method to convert the entity back to a raw JSON format, typically used when saving the profile.
 */
import CriteriaEntity from "@/lib/entities/criteria-entity";
import LocationEntity from "@/lib/entities/location/location-entity";

class UserProfileEntity {
    private userId: string;
    private name: string;
    private email: string;
    private presets: CriteriaEntity[];
    private locations: LocationEntity[];

    /**
     * create an instance of UserProfile
     * 
     * @param {string} userId - the unqiue identifier of the user
     * @param {string} name - the name of the user
     * @param {string} email - the email address of the user
     * @param {Presets} presets - the user's preset configurations
     */
    constructor() {
        this.userId = "null";
        this.name = "";
        this.email = "";
        this.presets = [];
        this.locations = [];
    }


    /**
     * retrieves the user's ID
     * 
     * @returns {string} the unique identifier of the user
     */
    public getUserId(): string {
        return this.userId;
    }

    public setUserId(userId: string) {
        this.userId = userId;
    }

    /**
     * retrieves the user's name
     * @returns {string} the name of the user
     */
    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }


    /**
     * Retrieves the user's email address.
     * 
     * @returns {string} The email address of the user.
     */
    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    /**
     * Retrieves the user's presets.
     * 
     * @returns {Presets} The user's preset configurations.
     */
    public getPresets(): CriteriaEntity[] {
        return this.presets;
    }


    public getLocations(): LocationEntity[] {
        return this.locations;
    }

    public hasLocation(location: LocationEntity) {
        return this.locations.some((l) => l.equals(location));
    }

    public addLocation(location: LocationEntity) {
        this.locations = [...this.locations.filter((l) => !l.equals(location)), location];
    }

    public removeLocation(location: LocationEntity) {
        this.locations = this.locations.filter((l) => !l.equals(location))
    }

    public setPresets(presets: CriteriaEntity[]) {
        this.presets = presets;
    }

    public setLocations(locations: LocationEntity[]) {
        this.locations = locations;
    }

    public toJSON(): Record<string, unknown> {
        return {
            userId: this.userId,
            name: this.name,
            email: this.email,
            presets: this.presets ? this.presets.map(preset => preset.toJSON()) : [],
            locations: this.locations.map(location => location.toJSON()),
        };
    }

    public fromJSON(data: Record<string, unknown>) {
        this.userId = data.userId as string ?? "";
        this.name = data.name as string ?? "";
        this.email = data.email as string ?? "";

        this.presets = (data.presets as [] ?? []).map((p) => {
            const criteria = new CriteriaEntity()
            criteria.fromJSON(p);
            return criteria;
        });

        this.locations = (data.locations as [] ?? []).map((p : Record<string, unknown>) => {
            const lat = p.latitude as number;
            const long = p.longitude as number;
            const address = p.address as string;
            if (address)
                return new LocationEntity(lat, long, address);
            else
                return new LocationEntity(lat, long);
        });
    }

}
export default UserProfileEntity;