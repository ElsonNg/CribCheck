import DBService from '@/lib/boundary/db-service';
import UserProfileEntity from '@/lib/entities/user-profile-entity';
import Presets from '../entities/presets-entity';
import CriteriaEntity from '../entities/criteria-entity';
import LocationEntity from '../entities/location/location-entity';
import AuthUserEntity from '../entities/auth-user-entity';

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
    private userProfile: UserProfileEntity;

    /**
     * Creates an instance of `UserProfileController` and sets the `DBService` used to handle database operations.
     * 
     * @param {DBService<any>} dbService - The `DBService` instance responsible for performing data retrieval and storage actions.
     */
    constructor(dbService: DBService<Record<string, unknown>>) {
        this.dbService = dbService;
        this.userProfile = new UserProfileEntity();
    }



    /**
     * Loads the user profile from the database using the `DBService`.
     * 
     * This method interacts with the `DBService` to fetch the user profile and maps the result to the `UserProfile` entity.
     * 
     * @param {string} userId - The unique identifier of the user whose profile is to be loaded.
     * @returns {Promise<UserProfileEntity | null>} A promise that resolves to the user profile entity or `null` if no profile is found.
     */
    async loadUserProfile(userId: string): Promise<boolean> {
        const profileData = await this.dbService.loadUserProfile(userId);
        if (!profileData) return false;
        this.userProfile.fromJSON(profileData);
        return true;
    }

    /**
     * Saves or updates the user profile in the database using the `DBService`.
     * 
     * This method converts the `UserProfile` entity back to raw JSON and then interacts with the `DBService` to save the profile.
     * 
     * @param {UserProfileEntity} userProfile - The user profile entity to be saved or updated.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    private async saveUserProfile(authUser: AuthUserEntity): Promise<boolean> {
        this.userProfile.setUserId(authUser.getId());
        this.userProfile.setName(authUser.getName());
        this.userProfile.setEmail(authUser.getEmail());
        const result = await this.dbService.saveUserProfile(this.userProfile.toJSON(), this.userProfile.getUserId());  // Pass the UserProfile entity and userId directly
        return result != null;
    }

    public async saveLocation(authUser: AuthUserEntity, location: LocationEntity): Promise<boolean> {
        this.userProfile.addLocation(location);
        return await this.saveUserProfile(authUser);
    }

    public async removeSavedLocation(authUser: AuthUserEntity, location: LocationEntity): Promise<boolean> {
        this.userProfile.removeLocation(location);
        return await this.saveUserProfile(authUser);
    }

    public getProfile(): UserProfileEntity {
        return this.userProfile;
    }
}

export default UserProfileController;