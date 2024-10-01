import DBService from '@/lib/boundary/db-service';
import UserProfile from '@/lib/entities/user-profile-entity';

/**
 * The `UserProfileController` class is responsible for managing user profiles by interacting with a `DBService` implementation. 
 * It retrieves and saves user profiles from and to the database 
 * 
 * The controller relies on **Dependency Injection (DI)** to receive the `DBService`, allowing flexibility to swap out different database providers.
 * 
 * @class UserProfileController
 */


class UserProfileController {
    private dbService: DBService<any>;

    /**
     * Creates an instance of `UserProfileController` and sets the `DBService` used to handle database operations.
     * 
     * @param {DBService<any>} dbService - The `DBService` instance responsible for performing data retrieval and storage actions.
     */
    constructor(dbService: DBService<any>) {
        this.dbService = dbService;
    }

    /**
     * Maps user profile data to the internal `UserProfile` entity.
     * 
     * @param {any} userProfileData - The user profile data to be mapped.
     * @returns {UserProfile} The adapted internal user profile entity.
     */
    private mapToUserProfileEntity(userProfileData: any): UserProfile {
        return new UserProfile(userProfileData.userId, userProfileData.name, userProfileData.email, userProfileData.presets);
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
        await this.dbService.saveUserProfile(userProfile, userId);  // Pass the UserProfile entity and userId directly
    }
}

export default UserProfileController;