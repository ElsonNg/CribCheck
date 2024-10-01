/**
 * @class UserProfile
 * 
 * The `UserProfile` class represents the user's profile data within the application.
 * It includes attributes such as `userId`, `name`, `email`, and `presets`.
 * 
 * This class provides methods to retrieve these attributes, and also includes
 * a method to convert the entity back to a raw JSON format, typically used when saving the profile.
 */
import Presets from "@/lib/entities/presets-entity";

class UserProfile {
    private userId: string;
    private name: string;
    private email: string;
    private presets: Presets;

    /**
     * create an instance of UserProfile
     * 
     * @param {string} userId - the unqiue identifier of the user
     * @param {string} name - the name of the user
     * @param {string} email - the email address of the user
     * @param {Presets} presets - the user's preset configurations
     */
    constructor(userId: string, name: string, email: string, presets: Presets) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.presets = presets;
    }
    /**
     * retrieves the user's ID
     * 
     * @returns {string} the unique identifier of the user
     */
    getuserId(): string {
        return this.userId;
    }

    /**
     * retrieves the user's name
     * @returns {string} the name of the user
     */
    getName(): string {
        return this.name;
    }
    /**
     * Retrieves the user's email address.
     * 
     * @returns {string} The email address of the user.
     */
    getEmail(): string {
        return this.email;
    }

    /**
     * Retrieves the user's presets.
     * 
     * @returns {Presets} The user's preset configurations.
     */
    getPresets(): Presets {
        return this.presets;
    }

}
export default UserProfile;