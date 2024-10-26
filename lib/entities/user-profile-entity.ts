/**
 * @class UserProfileEntity
 * 
 * The `UserProfileEntity` class represents the user's profile data within the application.
 * It includes attributes such as `userId`, `name`, `email`, `presets`, and `locations`.
 * 
 * This class provides methods to retrieve, update, and manage user information, including
 * presets and locations, as well as methods to convert the entity to and from JSON format
 * for easy storage and retrieval.
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
     * Creates an instance of `UserProfileEntity` with default values.
     */
    constructor() {
        this.userId = "null";
        this.name = "";
        this.email = "";
        this.presets = [];
        this.locations = [];
    }

    /**
     * Retrieves the user's unique identifier.
     * 
     * @returns {string} The unique identifier of the user.
     */
    public getUserId(): string {
        return this.userId;
    }

    /**
     * Sets the user's unique identifier.
     * 
     * @param {string} userId - The new user ID.
     */
    public setUserId(userId: string) {
        this.userId = userId;
    }

    /**
     * Retrieves the user's name.
     * 
     * @returns {string} The name of the user.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the user's name.
     * 
     * @param {string} name - The name to set for the user.
     */
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

    /**
     * Sets the user's email address.
     * 
     * @param {string} email - The email address to set for the user.
     */
    public setEmail(email: string) {
        this.email = email;
    }

    /**
     * Retrieves the user's saved presets.
     * 
     * @returns {CriteriaEntity[]} An array of the user's preset configurations.
     */
    public getPresets(): CriteriaEntity[] {
        return this.presets;
    }

    /**
     * Checks if a given preset exists in the user's saved presets.
     * 
     * @param {CriteriaEntity} preset - The preset to check.
     * @returns {boolean} `true` if the preset exists, otherwise `false`.
     */
    public hasPreset(preset: CriteriaEntity): boolean {
        return this.presets.some((p) => p.equals(preset));
    }

    /**
     * Adds a new preset to the user's saved presets.
     * 
     * @param {CriteriaEntity} preset - The preset to add.
     */
    public addPreset(preset: CriteriaEntity) {
        this.presets = [...this.presets, preset];
    }

    /**
     * Removes a specific preset from the user's saved presets.
     * 
     * @param {CriteriaEntity} preset - The preset to remove.
     */
    public removePreset(preset: CriteriaEntity) {
        this.presets = this.presets.filter((p) => !p.equals(preset));
    }

    /**
     * Retrieves the user's saved locations.
     * 
     * @returns {LocationEntity[]} An array of the user's saved locations.
     */
    public getLocations(): LocationEntity[] {
        return this.locations;
    }

    /**
     * Checks if a specific location exists in the user's saved locations.
     * 
     * @param {LocationEntity} location - The location to check.
     * @returns {boolean} `true` if the location exists, otherwise `false`.
     */
    public hasLocation(location: LocationEntity): boolean {
        return this.locations.some((l) => l.equals(location));
    }

    /**
     * Adds a new location to the user's saved locations, replacing any duplicate.
     * 
     * @param {LocationEntity} location - The location to add.
     */
    public addLocation(location: LocationEntity) {
        this.locations = [...this.locations.filter((l) => !l.equals(location)), location];
    }

    /**
     * Removes a specific location from the user's saved locations.
     * 
     * @param {LocationEntity} location - The location to remove.
     */
    public removeLocation(location: LocationEntity) {
        this.locations = this.locations.filter((l) => !l.equals(location));
    }

    /**
     * Sets the user's presets with a given array of `CriteriaEntity` objects.
     * 
     * @param {CriteriaEntity[]} presets - The array of presets to set.
     */
    public setPresets(presets: CriteriaEntity[]) {
        this.presets = presets;
    }

    /**
     * Sets the user's locations with a given array of `LocationEntity` objects.
     * 
     * @param {LocationEntity[]} locations - The array of locations to set.
     */
    public setLocations(locations: LocationEntity[]) {
        this.locations = locations;
    }

    /**
     * Converts the user's profile data to a JSON object for easy storage.
     * 
     * @returns {Record<string, unknown>} The JSON representation of the user's profile data.
     */
    public toJSON(): Record<string, unknown> {
        return {
            userId: this.userId,
            name: this.name,
            email: this.email,
            presets: this.presets ? this.presets.map(preset => preset.toJSON()) : [],
            locations: this.locations.map(location => location.toJSON()),
        };
    }

    /**
     * Loads profile data from a JSON object and updates this instance's properties.
     * 
     * @param {Record<string, unknown>} data - The JSON object containing profile data.
     */
    public fromJSON(data: Record<string, unknown>) {
        this.userId = data.userId as string ?? "";
        this.name = data.name as string ?? "";
        this.email = data.email as string ?? "";

        this.presets = (data.presets as [] ?? []).map((p: Record<string, number>) => {
            const criteria = new CriteriaEntity();
            criteria.fromJSON(p);
            criteria.setName("Saved");
            return criteria;
        });

        this.locations = (data.locations as [] ?? []).map((p: Record<string, unknown>) => {
            const lat = p.latitude as number;
            const long = p.longitude as number;
            const address = p.address as string;
            if (address) return new LocationEntity(lat, long, address);
            else return new LocationEntity(lat, long);
        });
    }
}

export default UserProfileEntity;
