/**
 * @class AuthUserEntity
 * 
 * Represents an authenticated user within the application. This entity encapsulates user-specific 
 * details, such as the unique identifier, email, and name, and provides access methods for each property.
 */
class AuthUserEntity {
    private id: string;
    private email: string;
    private name: string;

    /**
     * Constructs an instance of `AuthUserEntity` with the specified user details.
     * 
     * @param {string} id - The unique identifier for the user.
     * @param {string} email - The user's email address.
     * @param {string} name - The user's name.
     */
    constructor(id: string, email: string, name: string) {
        this.id = id;
        this.email = email;
        this.name = name;
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
     * Retrieves the user's email address.
     * 
     * @returns {string} The email address of the user.
     */
    public getEmail(): string {
        return this.email;
    }

    /**
     * Retrieves the user's unique identifier.
     * 
     * @returns {string} The unique ID of the user.
     */
    public getId(): string {
        return this.id;
    }
}

export default AuthUserEntity;
