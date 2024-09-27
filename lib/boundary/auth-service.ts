/**
 * AuthService is an abstract class representing an authentication service.
 * 
 * This class serves as a blueprint for any authentication services
 * (e.g., Firebase, OAuth, etc.). It defines the basic contract that
 * any derived class must implement for handling user authentication.
 * 
 * Classes that extend `AuthService` must provide implementations for:
 * - `loginWithGoogle`: Handle user login via Google.
 * - `logout`: Handle user logout.
 * - `getCurrentUser`: Retrieve the currently authenticated user.
 * 
 * This follows the Repository (specialised Facade) pattern, 
 * providing an interface for communication while ensuring Open-Closed Principle 
 * where code is open for extension but closed for modification.
 * 
 * @template T - The type of the authenticated user, created as an Entity
 * 
 * @abstract
 * @class AuthService
 */
abstract class AuthService<T> {

    /**
     * Abstract method to handle user login via Google.
     * 
     * Derived classes must implement this method to provide
     * the logic for authenticating a user via Google.
     * 
     * @returns {Promise<boolean>} A promise that resolves to `true` if the user is successfully logged in.
     */
    abstract loginWithGoogle() : Promise<T | null>;

     /**
     * Abstract method to handle user logout.
     * 
     * Derived classes must implement this method to provide
     * the logic for logging out a user.
     * 
     * @returns {Promise<boolean>} A promise that resolves to `true` if the user is successfully logged out.
     */
    abstract logout() : Promise<boolean>;

    /**
     * Abstract method to get the currently authenticated user.
     * 
     * Derived classes must implement this method to return the
     * authenticated user's information.
     * 
     * @returns {Promise<T | null>} A promise that resolves to the authenticated user object, or `null` if no user is authenticated.
     */
    abstract getCurrentUser() : T | null;
}

export default AuthService;