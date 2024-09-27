import { User as FirebaseUser } from "firebase/auth";
import AuthService from '@/lib/boundary/auth-service';
import AuthUserEntity from '@/lib/entities//auth-user-entity';

/**
 * The `AuthController` class is responsible for managing user authentication
 * by interacting with an `AuthService` implementation. It maps external
 * Firebase users to the internal `AuthUserEntity` used within the application.
 * 
 * This controller handles user login, logout, and fetching the currently
 * authenticated user while ensuring that the external user object is transformed
 * into the application's domain model (`AuthUserEntity`).
 * 
 * The controller relies on  **Dependency Injection (DI)** to receive the `AuthService`,
 * allowing flexibility to swap authentication providers.
 * 
 * @class AuthController
 */
class AuthController {

    private authService: AuthService<FirebaseUser>;

    /**
     * Creates an instance of `AuthController` and sets the `AuthService` used to
     * handle authentication logic.
     * 
     * @param authService - The `AuthService` instance responsible for performing authentication actions.
     */
    constructor(authService: AuthService<FirebaseUser>) {
        this.authService = authService;
    }

    /**
     * Maps the external FirebaseUser object to the internal `AuthUserEntity`.
     * 
     * This method is used to convert the `FirebaseUser` (provided by Firebase Authentication)
     * to the internal `AuthUserEntity` used in the domain layer of the application.
     * 
     * @param firebaseUser - The Firebase user object to be mapped.
     * @returns {AuthUserEntity} The adapted internal user entity.
     */
    private mapToAuthUserEntity(firebaseUser: FirebaseUser): AuthUserEntity {
        return new AuthUserEntity(firebaseUser.uid, firebaseUser.email ?? '', firebaseUser.displayName ?? '');
    }

    /**
     * Handles user login via Google using the `AuthService`.
     * 
     * This method interacts with the `AuthService` to perform the Google login and
     * maps the result (if successful) from a `FirebaseUser` to an `AuthUserEntity`.
     * 
     * @returns {Promise<AuthUserEntity | null>} A promise that resolves to the authenticated
     * user entity or `null` if the login fails or no user is authenticated.
     */
    async loginWithGoogle(): Promise<AuthUserEntity | null> {
        const user = await this.authService.loginWithGoogle();
        if (!user) return null;
        return this.mapToAuthUserEntity(user);
    }

    /**
     * Logs out the currently authenticated user using the `AuthService`.
     * 
     * This method delegates the logout action to the `AuthService` implementation.
     * 
     * @returns {Promise<boolean>} A promise that resolves to `true` if the user
     * was successfully logged out, or `false` if the operation failed.
     */
    async logout(): Promise<boolean> {
        return this.authService.logout();
    }

    /**
     * Retrieves the currently authenticated user from the `AuthService`.
     * 
     * This method fetches the current user from Firebase and maps the result
     * to the internal `AuthUserEntity`. If no user is authenticated, it resolves to `null`.
     * 
     * @returns {Promise<AuthUserEntity | null>} A promise that resolves to the authenticated
     * user entity or `null` if no user is authenticated.
     */
    getCurrentUser(): AuthUserEntity | null {
        const user = this.authService.getCurrentUser();
        if (!user) return null;
        return this.mapToAuthUserEntity(user);
    }
}

export default AuthController;
