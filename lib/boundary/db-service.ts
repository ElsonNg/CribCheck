/**
 * DBService is an abstract class representing a database service.
 * 
 * This class serves as a blueprint for any database services (eg. Firebase, MongoDB, etc.).
 * It defines the basic contract that any derived class must implement for handling user profile operations.
 * 
 * Classes that extend 'DBServices' must provide implementatins for:
 * - 'fetchUserProfile' : Retrieve user profile by userID
 * - 'saveUserProfile' : Save or update a user profile
 * 
 * @template T - the type of the user profile, created as an Entitiy
 * 
 * @abstract
 * @class DBService
 */

abstract class DBService<T> {

    /**
     * Abstract Method to load a user profile by userID.
     * 
     * Derived classes must implement this method to provide the logic for retrieving a user profile from database
     * 
     * @param userId - The unique identifier of the user
     * @returns {Promise<T>} A promise that resolves to the user profile data.
     */
    abstract loadUserProfile(userId: string): Promise<T>;
    /**
     * abstract method to save or update a user profile
     * 
     * Derived classes must implement this method to provide the logic for saving or updating a user profile in the database
     * 
     * @param {T} userProfileData - the user profile data to be saved or updated
     * @param {string} userId - the unique identifier of the user
     * @returns {Promise<void>} a promise that resolves when the operation is complete
     */
    abstract saveUserProfile(userProfileData: T, userId: string): Promise<void>;

}

export default DBService;