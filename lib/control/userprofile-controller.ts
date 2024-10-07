import DBService from '@/lib/boundary/db-service';
import UserProfile from '@/lib/entities/user-profile-entity';
import Presets from '../entities/presets-entity';

/**
 * The `UserProfileController` class is responsible for managing user profiles by interacting with a `DBService` implementation. 
 * It retrieves and saves user profiles from and to the database 
 * 
 * The controller relies on **Dependency Injection (DI)** to receive the `DBService`, allowing flexibility to swap out different database providers.
 * 
 * @class UserProfileController
 */


class UserProfileController {
    private dbService: DBService<Record<string, unknown>>;

    /**
     * Creates an instance of `UserProfileController` and sets the `DBService` used to handle database operations.
     * 
     * @param {DBService<any>} dbService - The `DBService` instance responsible for performing data retrieval and storage actions.
     */
    constructor(dbService: DBService<Record<string, unknown>>) {
        this.dbService = dbService;
    }

    /**
     * Maps user profile data to the internal `UserProfile` entity.
     * 
     * @param {any} userProfileData - The user profile data to be mapped.
     * @returns {UserProfile} The adapted internal user profile entity.
     */
    private mapToUserProfileEntity(userProfileData: Record<string, unknown>): UserProfile {
        const userId = userProfileData.userId as string;
        const name = userProfileData.name as string;
        const email = userProfileData.email as string;
        const presetData = userProfileData.presets as Record<string, unknown>;
        const presets = new Presets(presetData.presetID as number, presetData.maritalStatus as string, presetData.familyStatus as string, presetData.purchasePurpose as string);
        return new UserProfile(userId, name, email, presets);
    }
    
    
    /**
     * Maps a `UserProfile` entity back to raw JSON data.
     * 
     * This method converts the internal `UserProfile` entity into a plain JavaScript object 
     * that can be stored in the database.
     * 
     * @param {UserProfile} userProfile - The user profile entity to be converted.
     * @returns {Record<string, unknown>} The raw user profile data to be stored.
     */
    private mapToRawUserProfile(userProfile: UserProfile): Record<string, unknown> {
        return {
            userId: userProfile.getuserId(),
            name: userProfile.getName(),
            email: userProfile.getEmail(),
            presets: {
                presetID: userProfile.getPresets().getPresetID(),
                maritalStatus: userProfile.getPresets().getMaritalStatus(),
                familyStatus: userProfile.getPresets().getFamilyStatus(),
                purchasePurpose: userProfile.getPresets().getPurchasePurpose(),
            }
        };
    }

    /**
     * Loads the user profile from the database using the `DBService`.
     * 
     * This method interacts with the `DBService` to fetch the user profile and maps the result to the `UserProfile` entity.
     * 
     * @param {string} userId - The unique identifier of the user whose profile is to be loaded.
     * @returns {Promise<UserProfile | null>} A promise that resolves to the user profile entity or `null` if no profile is found.
     */
    async loadUserProfile(userId: string): Promise<UserProfile | null> {
        const profileData = await this.dbService.loadUserProfile(userId);
        if (!profileData) return null;
        return this.mapToUserProfileEntity(profileData);
    }

    /**
     * Saves or updates the user profile in the database using the `DBService`.
     * 
     * This method converts the `UserProfile` entity back to raw JSON and then interacts with the `DBService` to save the profile.
     * 
     * @param {UserProfile} userProfile - The user profile entity to be saved or updated.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    async saveUserProfile(userProfile: UserProfile): Promise<void> {
        const userId = userProfile.getuserId();  // Get the userId from the UserProfile entity
        await this.dbService.saveUserProfile(this.mapToRawUserProfile(userProfile), userId);  // Pass the UserProfile entity and userId directly
    }
}

export default UserProfileController;