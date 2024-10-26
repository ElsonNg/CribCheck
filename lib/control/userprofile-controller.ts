import DBService from '@/lib/boundary/db-service';
import UserProfileEntity from '@/lib/entities/user-profile-entity';
import CriteriaEntity from '../entities/criteria-entity';
import LocationEntity from '../entities/location/location-entity';
import AuthUserEntity from '../entities/auth-user-entity';

/**
 * `UserProfileController` manages user profile data by interacting with a `DBService` for persistence.
 * 
 * This controller loads, saves, and updates user profiles, allowing the addition and removal of user-specific
 * locations and presets. It maps data between the external data source and the application's `UserProfileEntity`.
 * 
 * @class UserProfileController
 */
class UserProfileController {
    private dbService: DBService<Record<string, unknown>>;
    private userProfile: UserProfileEntity;

    /**
     * Initializes the `UserProfileController` with a `DBService` instance.
     * 
     * @param {DBService<any>} dbService - Database service for performing user profile data operations.
     */
    constructor(dbService: DBService<Record<string, unknown>>) {
        this.dbService = dbService;
        this.userProfile = new UserProfileEntity();
    }

    /**
     * Loads a user's profile from the database based on their unique identifier.
     * 
     * If the profile exists, it is loaded into the `userProfile` entity.
     * 
     * @param {string} userId - The unique user identifier for loading profile data.
     * @returns {Promise<boolean>} `true` if the profile was successfully loaded, otherwise `false`.
     */
    async loadUserProfile(userId: string): Promise<boolean> {
        const profileData = await this.dbService.loadUserProfile(userId);
        if (!profileData) return false;
        this.userProfile.fromJSON(profileData);
        return true;
    }

    /**
     * Saves or updates the current user profile in the database.
     * 
     * This method syncs the current `UserProfileEntity` to the database by converting it to JSON.
     * 
     * @param {AuthUserEntity} authUser - The authenticated user whose profile is being saved.
     * @returns {Promise<boolean>} `true` if the profile was successfully saved, otherwise `false`.
     */
    private async saveUserProfile(authUser: AuthUserEntity): Promise<boolean> {
        this.userProfile.setUserId(authUser.getId());
        this.userProfile.setName(authUser.getName());
        this.userProfile.setEmail(authUser.getEmail());
        const result = await this.dbService.saveUserProfile(this.userProfile.toJSON(), this.userProfile.getUserId());
        return result != null;
    }

    /**
     * Adds a new location to the user profile and saves the updated profile.
     * 
     * @param {AuthUserEntity} authUser - The authenticated user.
     * @param {LocationEntity} location - The location to be added to the user profile.
     * @returns {Promise<boolean>} `true` if the location was successfully saved, otherwise `false`.
     */
    public async saveLocation(authUser: AuthUserEntity, location: LocationEntity): Promise<boolean> {
        this.userProfile.addLocation(location);
        return await this.saveUserProfile(authUser);
    }

    /**
     * Removes a location from the user profile and saves the updated profile.
     * 
     * @param {AuthUserEntity} authUser - The authenticated user.
     * @param {LocationEntity} location - The location to be removed from the user profile.
     * @returns {Promise<boolean>} `true` if the location was successfully removed, otherwise `false`.
     */
    public async removeSavedLocation(authUser: AuthUserEntity, location: LocationEntity): Promise<boolean> {
        this.userProfile.removeLocation(location);
        return await this.saveUserProfile(authUser);
    }

    /**
     * Adds a preset criteria set to the user profile and saves the updated profile.
     * 
     * @param {AuthUserEntity} authUser - The authenticated user.
     * @param {CriteriaEntity} preset - The preset criteria to be added.
     * @returns {Promise<boolean>} `true` if the preset was successfully saved, otherwise `false`.
     */
    public async savePreset(authUser: AuthUserEntity, preset: CriteriaEntity): Promise<boolean> {
        this.userProfile.addPreset(preset);
        return await this.saveUserProfile(authUser);
    }

    /**
     * Removes a preset criteria set from the user profile and saves the updated profile.
     * 
     * @param {AuthUserEntity} authUser - The authenticated user.
     * @param {CriteriaEntity} preset - The preset criteria to be removed.
     * @returns {Promise<boolean>} `true` if the preset was successfully removed, otherwise `false`.
     */
    public async removeSavedPreset(authUser: AuthUserEntity, preset: CriteriaEntity): Promise<boolean> {
        this.userProfile.removePreset(preset);
        return await this.saveUserProfile(authUser);
    }

    /**
     * Retrieves the current `UserProfileEntity`.
     * 
     * @returns {UserProfileEntity} The loaded user profile entity.
     */
    public getProfile(): UserProfileEntity {
        return this.userProfile;
    }
}

export default UserProfileController;
